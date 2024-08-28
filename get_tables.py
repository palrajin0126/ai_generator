import psycopg2
from psycopg2 import sql
import streamlit as st

# Database connection parameters
db_params = {
    'dbname': 'socialmedia',
    'user': 'root',
    'password': 'arka1256',
    'host': 'localhost',
    'port': '5432'
}


def get_all_tables(cursor):
    """Retrieve all table names from the public schema."""
    cursor.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    """)
    tables = cursor.fetchall()
    return [table[0] for table in tables]


def fetch_table_content(cursor, table_name):
    """Fetch all content from a given table."""
    cursor.execute(sql.SQL("SELECT * FROM {}").format(sql.Identifier(table_name)))
    rows = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
    return column_names, rows


def delete_row(cursor, conn, table_name, row_id):
    """Delete a row from the given table."""
    cursor.execute(sql.SQL("DELETE FROM {} WHERE id = %s").format(sql.Identifier(table_name)), [row_id])
    conn.commit()


def main():
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()

    st.title("PostgreSQL Table Viewer")

    # Get all tables
    tables = get_all_tables(cursor)
    selected_table = st.selectbox("Select Table", tables)

    if selected_table:
        column_names, rows = fetch_table_content(cursor, selected_table)

        if rows:
            # Display table with radio buttons
            selected_row = st.radio("Select Row", [i for i, _ in enumerate(rows)], format_func=lambda x: rows[x])

            st.write(f"Selected Row: {rows[selected_row]}")

            delete_button = st.button("Delete Row")
            if delete_button:
                delete_row(cursor, conn, selected_table, rows[selected_row][0])
                st.success("Row deleted successfully.")
                st.rerun()  # Refresh the page to show updated table

        else:
            st.warning("No data available in this table.")

    # Close the cursor and connection
    cursor.close()
    conn.close()


if __name__ == "__main__":
    main()
