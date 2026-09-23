"""
Test Suite for AI-Driven Smart Traffic Enforcement System
Tests API endpoints, human review lifecycle, and demo payment settlement.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "cpu_usage_percent" in data

def test_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_vehicles_today" in data
    assert "total_violations_today" in data
    assert data["total_cameras"] >= 1

def test_auth_login_demo():
    payload = {"username": "admin", "password": "admin123"}
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    token = response.json()
    assert "access_token" in token
    assert token["role"] == "ADMIN"

def test_violations_flow():
    # 1. Fetch violations
    res = client.get("/api/violations")
    assert res.status_code == 200
    items = res.json()
    assert len(items) > 0
    first_id = items[0]["id"]

    # 2. Get AI explanation
    explain_res = client.get(f"/api/violations/{first_id}/explain")
    assert explain_res.status_code == 200
    assert "explanation" in explain_res.json()

def test_vehicles_search():
    res = client.get("/api/vehicles?query=MH-12")
    assert res.status_code == 200
    vehicles = res.json()
    assert len(vehicles) >= 1
    assert "MH-12-DE-4021" in [v["plate_number"] for v in vehicles]

def test_demo_payment_flow():
    # Fetch fines
    fines_res = client.get("/api/payments/fines")
    assert fines_res.status_code == 200
    fines = fines_res.json()
    unpaid = [f for f in fines if f["status"] == "UNPAID"]
    if unpaid:
        target_fine = unpaid[0]
        pay_res = client.post("/api/payments/checkout/demo", json={
            "fine_id": target_fine["id"],
            "payment_method": "DEMO_UPI"
        })
        assert pay_res.status_code == 200
        data = pay_res.json()
        assert data["status"] == "SUCCESS"
        assert "TXN-DEMO-" in data["transaction_ref"]
