from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

#testing the endpoints

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
