def test_list_employees_supports_search_and_pagination(client, employees):
    response = client.get("/api/employees", params={"q": "Aarav", "page_size": 1})
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["employee_code"] == "E00001"
    assert body["items"][0]["salary_usd"] == "23800.00"

def test_create_employee(client):
    payload = {"employee_code": "E00003", "first_name": "Priya", "last_name": "Patel", "email": "priya.patel@example.com", "country": "United Kingdom", "department": "Marketing", "job_title": "Marketing Specialist", "salary_amount": "60000.00", "currency": "GBP"}
    response = client.post("/api/employees", json=payload)
    assert response.status_code == 201
    assert response.json()["employee_code"] == "E00003"

def test_create_employee_rejects_duplicate_code(client, employees):
    payload = {"employee_code": "E00001", "first_name": "Duplicate", "last_name": "User", "email": "duplicate@example.com", "country": "India", "department": "Engineering", "job_title": "Software Engineer", "salary_amount": "1000000.00", "currency": "INR"}
    response = client.post("/api/employees", json=payload)
    assert response.status_code == 409

def test_update_employee_salary(client, employees):
    response = client.patch("/api/employees/1", json={"salary_amount": "2500000.00", "currency": "INR"})
    assert response.status_code == 200
    body = response.json()
    assert body["salary_amount"] == "2500000.00"
    assert body["salary_usd"] == "29750.00"

def test_update_missing_employee_returns_404(client):
    response = client.patch("/api/employees/999", json={"salary_amount": "100000"})
    assert response.status_code == 404

def test_analytics_endpoint(client, employees):
    response = client.get("/api/analytics/summary")
    assert response.status_code == 200
    body = response.json()
    assert body["employee_count"] == 2
    assert body["reporting_currency"] == "USD"
    assert body["reporting_note"]

def test_meta_options_endpoint(client, employees):
    response = client.get("/api/meta/options")
    assert response.status_code == 200
    body = response.json()
    assert "India" in body["countries"]
    assert "Engineering" in body["departments"]

def test_create_employee_rejects_unsupported_currency(client):
    payload = {
        "employee_code": "E00003",
        "first_name": "Priya",
        "last_name": "Patel",
        "email": "priya@example.com",
        "country": "India",
        "department": "Marketing",
        "job_title": "Marketing Specialist",
        "salary_amount": "60000.00",
        "currency": "JPY",
    }
    response = client.post("/api/employees", json=payload)
    assert response.status_code == 422
