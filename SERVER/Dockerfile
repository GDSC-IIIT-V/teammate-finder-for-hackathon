# Use the official Python image as a base image
FROM python:3.12.0

# Set environment variables for PostgreSQL
ENV PGHOST=postgis-container
ENV PGPORT=5432
ENV PGUSER=postgres
ENV PGPASSWORD=admin123
ENV PGDATABASE=isro_postgis

# Set the working directory to /app
WORKDIR /app

# Copy only the necessary files
COPY . /app/

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install Gunicorn
RUN pip install gunicorn

# Expose the port that Gunicorn will run on
EXPOSE 5000

# Command to run your application with Gunicorn
CMD ["gunicorn", "-w", "4", "main:app", "-b", "0.0.0.0:5000"]
