from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os

class GoogleDriveUploader:
    def __init__(self, credentials_path):
        """
        Initialize the uploader with service account credentials.

        Args:
            credentials_path (str): Path to the service account JSON file
        """
        # Define the scopes
        self.SCOPES = ['https://www.googleapis.com/auth/drive.file']
        self.credentials_path = credentials_path
        self.service = None

    def authenticate(self):
        """Authenticate using service account credentials."""
        try:
            credentials = service_account.Credentials.from_service_account_file(
                self.credentials_path,
                scopes=self.SCOPES
            )

            # Build the service
            self.service = build('drive', 'v3', credentials=credentials)
            print("Successfully authenticated with service account")

        except Exception as e:
            print(f"Authentication error: {str(e)}")
            raise

    def upload_image(self, image_path, folder_id=None):
        """
        Upload an image to Google Drive.

        Args:
            image_path (str): Path to the image file
            folder_id (str, optional): ID of the folder to upload to
        """
        try:
            # File metadata
            file_metadata = {
                'name': os.path.basename(image_path)
            }

            # If folder_id is provided, set it as the parent
            if folder_id:
                file_metadata['parents'] = [folder_id]

            # Create media file upload object
            media = MediaFileUpload(
                image_path,
                mimetype='image/*',
                resumable=True
            )

            # Execute the upload
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, name, webViewLink'
            ).execute()

            print(f"Successfully uploaded {file.get('name')}")
            print(f"File ID: {file.get('id')}")
            print(f"Web View Link: {file.get('webViewLink')}")

            return file

        except Exception as e:
            print(f"Upload error: {str(e)}")
            return None

    def share_file(self, file_id, email):
        """
        Share a file with a specific user.

        Args:
            file_id (str): The ID of the file to share
            email (str): The email address to share with
        """
        try:
            permission = {
                'type': 'user',
                'role': 'reader',
                'emailAddress': email
            }

            self.service.permissions().create(
                fileId=file_id,
                body=permission,
                sendNotificationEmail=False
            ).execute()

            print(f"Successfully shared file with {email}")

        except Exception as e:
            print(f"Sharing error: {str(e)}")

def main():
    # Path to your service account credentials JSON file
    credentials_path = 'service-account-credentials.json'

    # Initialize uploader
    uploader = GoogleDriveUploader(credentials_path)

    try:
        # Authenticate
        uploader.authenticate()

        # Folder where your images are stored
        image_folder = "images"

        # Optional: Google Drive folder ID where you want to upload the images
        folder_id = None  # Replace with your folder ID if needed

        # Check if images folder exists
        if not os.path.exists(image_folder):
            print(f"Creating images folder at: {os.path.abspath(image_folder)}")
            os.makedirs(image_folder)
            print("Please place your images in this folder and run the script again.")
            return

        # Get list of image files
        images = [f for f in os.listdir(image_folder)
                 if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]

        if not images:
            print("No images found in the images folder.")
            print("Supported formats: PNG, JPG, JPEG, GIF, BMP")
            return

        # Upload each image
        print(f"Found {len(images)} images to upload.")
        for filename in images:
            image_path = os.path.join(image_folder, filename)
            print(f"\nUploading {filename}...")
            file = uploader.upload_image(image_path, folder_id)

            # Optional: Share the file with someone
            if file:
                uploader.share_file(file['id'], 'rout.rishav@gmail.com')

    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        print("\nPlease make sure you have:")
        print("1. Created a service account and downloaded the credentials")
        print("2. Placed the service account credentials JSON file in the correct location")
        print("3. Enabled the Google Drive API in your project")
        print("4. Placed your images in the 'images' folder")

if __name__ == '__main__':
    main()
