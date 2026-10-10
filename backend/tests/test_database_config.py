"""
backend/tests/test_database_config.py
Unit tests for database URL normalisation, Supabase PostgreSQL driver compatibility,
environment loading from backend/.env, and isolated test configurations.
P1 owns all changes.
"""

import os
from pathlib import Path
from unittest.mock import patch
import pytest

from backend.config import normalize_database_url, load_environment, Config
from backend.scripts.init_supabase_db import mask_db_url


def test_normalize_postgres_scheme():
    # Convert legacy postgres:// to postgresql+psycopg2://
    raw = "postgres://postgres.abc:secret@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
    expected = "postgresql+psycopg2://postgres.abc:secret@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
    assert normalize_database_url(raw) == expected


def test_normalize_postgresql_scheme():
    # Convert standard postgresql:// to postgresql+psycopg2://
    raw = "postgresql://postgres:secret@db.abc.supabase.co:5432/postgres"
    expected = "postgresql+psycopg2://postgres:secret@db.abc.supabase.co:5432/postgres"
    assert normalize_database_url(raw) == expected


def test_normalize_sqlite_fallback():
    # Empty string or None defaults to SQLite
    assert "sqlite:///" in normalize_database_url("")
    assert "sqlite:///" in normalize_database_url("   ")


def test_normalize_preserves_absolute_sqlite():
    raw = "sqlite:///C:/Users/test/custom.db"
    assert normalize_database_url(raw) == raw


def test_mask_db_url():
    # Verify passwords are never exposed in logs or console
    postgres_url = "postgresql://postgres:MySecretPassword123@db.projectref.supabase.co:5432/postgres"
    masked = mask_db_url(postgres_url)
    assert "MySecretPassword123" not in masked
    assert "postgres:****@db.projectref.supabase.co" in masked


def test_load_environment_loads_backend_env(tmp_path):
    # Verify load_environment correctly reads backend/.env
    dummy_backend_env = tmp_path / ".env"
    dummy_backend_env.write_text("TEST_CUSTOM_ENV_VAR=supabase_test_val\n", encoding="utf-8")

    with patch("backend.config._BACKEND_ENV", dummy_backend_env):
        load_environment()
        assert os.getenv("TEST_CUSTOM_ENV_VAR") == "supabase_test_val"

    # Clean up env var
    os.environ.pop("TEST_CUSTOM_ENV_VAR", None)


def test_test_config_preserves_sqlite_in_memory(app):
    # Requirement 5: Preserve SQLite support for isolated automated tests
    assert app.config["TESTING"] is True
    assert app.config["SQLALCHEMY_DATABASE_URI"] == "sqlite:///:memory:"
