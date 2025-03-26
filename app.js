import { initializeCharts, updateCharts } from './chartcomponent.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPX5SOMTCXziTnyp8VfxtGp3dWCHP931k",
  authDomain: "housing-40339.firebaseapp.com",
  projectId: "housing-40339",
  storageBucket: "housing-40339.firebasestorage.app",
  messagingSenderId: "320567801300",
  appId: "1:320567801300:web:f4d55fa58c97e930991241",
  measurementId: "G-FFWFD936GW"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const housesRef = db.collection('houses');

// DOM Elements
const propertyForm = document.getElementById('propertyForm');
const savePropertyBtn = document.getElementById('saveProperty');
const salesTable = document.getElementById('sales-table');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  initializeCharts();
  loadProperties();
  setupEventListeners();
});

function setupEventListeners() {
  // Status radio buttons
  document.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.getElementById('soldDateGroup').style.display = 
        e.target.value === 'sold' ? 'block' : 'none';
    });
  });

  // Save property
  savePropertyBtn.addEventListener('click', saveProperty);
}

// Load all properties
async function loadProperties() {
  try {
    const snapshot = await housesRef.orderBy('date_listed', 'desc').get();
    const properties = processProperties(snapshot);
    updateUI(properties);
  } catch (error) {
    handleError("Error loading properties:", error);
  }
}

function processProperties(snapshot) {
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date_listed: doc.data().date_listed?.toDate(),
    date_sold: doc.data().date_sold?.toDate()
  }));
}

function updateUI(properties) {
  updatePropertyTable(properties);
  updateSummaryCards(properties);
  updateCharts(properties);
}

function updatePropertyTable(properties) {
  salesTable.innerHTML = properties.map(property => `
    <tr>
      <td>${property.location}</td>
      <td>${property.type}</td>
      <td>$${property.price.toLocaleString()}</td>
      <td>${property.date_listed.toLocaleDateString()}</td>
      <td>${getStatusBadge(property)}</td>
      <td>${getActionButton(property)}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteProperty('${property.id}')">
          Delete
        </button>
      </td>
    </tr>
  `).join('');
}

function getStatusBadge(property) {
  return property.status === 'for_sale'
    ? '<span class="badge bg-success status-badge">For Sale</span>'
    : `<span class="badge bg-warning status-badge">Sold ${property.date_sold?.toLocaleDateString() || ''}</span>`;
}

function getActionButton(property) {
  return property.status === 'for_sale'
    ? `<button class="btn btn-warning btn-sm btn-status" onclick="markAsSold('${property.id}')">Mark Sold</button>`
    : '<span class="text-muted">N/A</span>';
}

function updateSummaryCards(properties) {
  const now = new Date();
  const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
  const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

  document.getElementById('for-sale-count').textContent = 
    properties.filter(p => p.status === 'for_sale').length;
  
  document.getElementById('new-listings').textContent = 
    properties.filter(p => p.date_listed > oneWeekAgo).length;
  
  document.getElementById('recently-sold').textContent = 
    properties.filter(p => p.status === 'sold' && p.date_sold > oneMonthAgo).length;
  
  document.getElementById('total-properties').textContent = properties.length;
}

// Property CRUD Operations
async function saveProperty() {
  try {
    const property = getFormData();
    await housesRef.add(property);
    showSuccess("Property saved successfully!");
    resetForm();
    loadProperties();
  } catch (error) {
    handleError("Error saving property:", error);
  }
}

function getFormData() {
  const status = document.querySelector('input[name="status"]:checked').value;
  const property = {
    location: document.getElementById('location').value.trim(),
    type: document.getElementById('type').value,
    price: Number(document.getElementById('price').value),
    status: status,
    date_listed: new Date(),
    agent: document.getElementById('agent').value || 'Unassigned'
  };

  if (status === 'sold') {
    const soldDate = document.getElementById('dateSold').value;
    property.date_sold = soldDate ? new Date(soldDate) : new Date();
  }

  return property;
}

async function markAsSold(propertyId) {
  const soldDate = prompt("Enter sale date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
  if (!soldDate) return;

  try {
    await housesRef.doc(propertyId).update({
      status: "sold",
      date_sold: new Date(soldDate)
    });
    loadProperties();
  } catch (error) {
    handleError("Error updating property:", error);
  }
}

async function deleteProperty(propertyId) {
  if (confirm("Are you sure you want to delete this property?")) {
    try {
      await housesRef.doc(propertyId).delete();
      loadProperties();
    } catch (error) {
      handleError("Error deleting property:", error);
    }
  }
}

// Helper Functions
function resetForm() {
  propertyForm.reset();
  document.getElementById('soldDateGroup').style.display = 'none';
  bootstrap.Modal.getInstance(document.getElementById('addPropertyModal')).hide();
}

function showSuccess(message) {
  alert(message);
}

function handleError(context, error) {
  console.error(context, error);
  alert(`${context.split(':')[0]}: ${error.message}`);
}

// Make functions available globally for HTML event handlers
window.markAsSold = markAsSold;
window.deleteProperty = deleteProperty;
