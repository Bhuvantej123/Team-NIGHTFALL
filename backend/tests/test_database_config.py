"""
backend/tests/test_database_config.py
Unit tests for database URL normalisation and Supabase PostgreSQL driver compatibility.
P1 owns all changes.
"""

from backend.config import normalize_database_url


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
