from main import app,db_uri
from flask import jsonify
import ast,os,csv
import psycopg2 as ps

@app.get("/load-data")
def load_data():
    try:
        conn = ps.connect(db_uri)
        cursor = conn.cursor()

        create_table_query = """
        CREATE TABLE IF NOT EXISTS weather_data (
            id SERIAL PRIMARY KEY,
            uwnd FLOAT,
            vwnd FLOAT,
            dir FLOAT,
            hs FLOAT,
            t0m1 FLOAT,
            phs01 FLOAT,
            phs02 FLOAT,
            pdi01 FLOAT,
            pdi02 FLOAT,
            elevation FLOAT,
            lat_lon GEOMETRY(Point, 4326)
        );
        """
        cursor.execute(create_table_query)
        print("Table weather_data created successfully.")

        # Load data from weather.csv
        filename = "weather.csv"
        with open(filename, 'r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                # Convert the row dictionary to a list of values
                values = list(row.values())

                insert_query = """
                    INSERT INTO weather_data (uwnd, vwnd, dir, hs, t0m1, phs01, phs02, pdi01, pdi02, elevation, lat_lon)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))
                """
                data = (
                    values[1], values[2], values[5], values[3], values[4],
                    values[6], values[7], values[8], values[9], values[10],
                    values[11], values[12]
                )
                cursor.execute(insert_query, data)
        print("Data loaded into weather_data table successfully.")

    finally:
        conn.commit()
        if cursor:
            cursor.close()

    return "Table created and data loaded successfully"



@app.get("/get-bathymetry-polygons")
def get_bathymetry_polygons():
    conn = ps.connect(db_uri)
    cursor = conn.cursor()
    query = """
        SELECT
            jsonb_build_object(
                'type', 'FeatureCollection',
                'features', jsonb_agg(feature)
            ) AS geojson
        FROM (
            SELECT
                jsonb_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(ST_ConvexHull(ST_Collect(ST_MakeEnvelope(ST_X(lat_lon), ST_Y(lat_lon), ST_X(lat_lon)+1.1, ST_Y(lat_lon)+1.1))))::jsonb,
                    'properties', jsonb_build_object(
                        'elevation', AVG(elevation)
                    )
                ) AS feature
            FROM weather_data
            GROUP BY ST_SnapToGrid(lat_lon, 1.0, 1.0)
        ) AS features;
    """

    cursor.execute(query)
    result = cursor.fetchone()
    with open('bathymetry_polygons3.json', 'w') as file:
        file.write(str(result))
    cursor.close()
    conn.close()
    return jsonify(result[0]),200

@app.get("/get-weather-data")
def get_weather_data():
    conn = ps.connect(db_uri)
    cursor = conn.cursor()
    query = """
        SELECT jsonb_build_object(
            'type', 'FeatureCollection',
            'features', jsonb_agg(feature)
        )
        FROM (
            SELECT jsonb_build_object(
                'type', 'Feature',
                'id', id,
                'geometry', ST_AsGeoJSON(lat_lon)::jsonb,
                'properties', to_jsonb(weather_data) - 'id' - 'lat_lon'
            ) AS feature
            FROM weather_data
        ) AS features;
    """

    cursor.execute(query)
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(result[0]),200