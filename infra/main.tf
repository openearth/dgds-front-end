provider "google" {
  project = "dgds-i1000482-002"
  region  = "europe-west4"
}

resource "google_cloud_run_service" "blue_earth_service" {
  name     = "blue-earth-service"
  location = "europe-west4"

  template {
    spec {
      containers {
        image = "europe-west4-docker.pkg.dev/dgds-i1000482-002/dgds-frontend/dgds-frontend:latest"
      
        ports {
          container_port = 80
        }
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.blue_earth_service.location
  project     = google_cloud_run_service.blue_earth_service.project
  service     = google_cloud_run_service.blue_earth_service.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

# resource "google_cloud_run_service_iam_binding" "blue_earth_service_binding" {
#   service = google_cloud_run_service.blue_earth_service.name
#   location = google_cloud_run_service.blue_earth_service.location
#   role    = "roles/run.invoker"

#   members = [
#     "user:<YOUR_EMAIL>",
#     "group:<YOUR_GROUP>",
#     "serviceAccount:<YOUR_SERVICE_ACCOUNT>"
#     # Add more members as needed
#   ]
# }