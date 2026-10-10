"""
backend/tests/test_creator_contract.py
Unit tests for creator profile contract validation and dataset rules.
P1 owns all changes.
"""

from backend.contracts.creator import validate_creator_dict
from backend.seed.seed import validate_dataset


def test_validate_valid_creator():
    valid = {
        "id": "c-1",
        "display_name": "Valid Creator",
        "handle": "@valid",
        "bio": "Bio description",
        "skills": ["video editing"],
        "niches": ["tech"],
        "platforms": [{"name": "instagram", "handle": "@valid"}],
        "starting_price": 500.0,
        "currency": "USD",
        "availability": True,
        "portfolio_evidence": "Evidence",
        "created_at": "2026-01-01T00:00:00Z",
    }
    errors = validate_creator_dict(valid)
    assert errors == []


def test_validate_missing_required_fields():
    invalid = {
        "id": "",
        "display_name": "",
        "handle": "",
        "bio": "",
        "starting_price": -10,
        "availability": "yes",  # not bool
        "skills": [],          # empty list
        "niches": [],
        "platforms": [],
    }
    errors = validate_creator_dict(invalid)
    assert len(errors) >= 5
    err_str = " ".join(errors)
    assert "starting_price" in err_str
    assert "availability" in err_str
    assert "skills" in err_str
    assert "niches" in err_str
    assert "platforms" in err_str


def test_validate_dataset_uniqueness():
    dataset = [
        {
            "id": "dup-id",
            "display_name": "C1",
            "handle": "@c1",
            "bio": "Bio",
            "skills": ["s1"],
            "niches": ["n1"],
            "platforms": [{"name": "instagram", "handle": "@c1"}],
            "starting_price": 100.0,
            "currency": "USD",
            "availability": True,
            "portfolio_evidence": "Ev",
            "created_at": "2026-01-01T00:00:00Z",
        },
        {
            "id": "dup-id",  # duplicate ID
            "display_name": "C2",
            "handle": "@c2",
            "bio": "Bio",
            "skills": ["s1"],
            "niches": ["n1"],
            "platforms": [{"name": "instagram", "handle": "@c2"}],
            "starting_price": 200.0,
            "currency": "USD",
            "availability": False,
            "portfolio_evidence": "Ev",
            "created_at": "2026-01-01T00:00:00Z",
        },
    ]
    valid, errors = validate_dataset(dataset)
    assert len(valid) == 1
    assert any("Duplicate creator id" in e for e in errors)
