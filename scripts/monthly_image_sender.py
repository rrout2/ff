import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from datetime import datetime
import yaml
import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import shutil


class ImageEmailSender:
    def __init__(self, config_path='config.yaml'):
        # Load configuration
        with open(config_path, 'r') as file:
            config = yaml.safe_load(file)

        # Parse email list from string to list if needed
        if isinstance(config['email_list'], str):
            self.email_list = [email.strip() for email in config['email_list'].split(',')]
        else:
            self.email_list = config['email_list']

        self.smtp_server = config['smtp_server']
        self.smtp_port = int(config['smtp_port'])
        self.sender_email = config['sender_email']
        self.sender_password = config['sender_password']

        self.website_url = 'https://rrout2.github.io/dynasty-ff/#/blueprintv2?leagueId=1120542227933155328&teamId=9&module=bigboy'
        self.download_button_selector = '#\:rq\:'


        # Create output directory if it doesn't exist
        self.download_dir = os.path.join(os.getcwd(), 'downloads')
        self.output_dir = os.path.join(os.getcwd(), 'images_to_send')
        os.makedirs(self.download_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)

    def setup_driver(self):
        """Setup Chrome driver with custom download settings"""
        chrome_options = webdriver.ChromeOptions()

        # Run headless in GitHub Actions
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')

        # Set download preferences
        prefs = {
            "download.default_directory": self.download_dir,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing.enabled": True
        }
        chrome_options.add_experimental_option("prefs", prefs)

        # Initialize the driver
        driver = webdriver.Chrome(options=chrome_options)
        return driver

    def wait_for_download(self, timeout=60):
        """Wait for download to complete"""
        time.sleep(5)
        seconds = 0
        dl_wait = True
        while dl_wait and seconds < timeout:
            time.sleep(1)
            dl_wait = False
            for fname in os.listdir(self.download_dir):
                if fname.endswith('.crdownload'):
                    dl_wait = True
            seconds += 1
        return seconds < timeout

    def download_image(self):
        """Navigate to website and click download button"""
        driver = self.setup_driver()
        try:
            # Navigate to the website
            driver.get(self.website_url)

            # Wait for and click the download button
            button = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, self.download_button_selector))
            )
            button.click()

            # Wait for download to complete
            if not self.wait_for_download():
                raise TimeoutException("Download timed out")

            # Get the latest downloaded file
            downloaded_files = os.listdir(self.download_dir)
            if not downloaded_files:
                raise Exception("No files found in download directory")

            latest_file = max([os.path.join(self.download_dir, f) for f in downloaded_files],
                            key=os.path.getctime)

            return latest_file

        finally:
            driver.quit()

    def send_email(self, recipient_email, image_path):
        """Send email with attached image"""
        msg = MIMEMultipart()
        msg['From'] = self.sender_email
        msg['To'] = recipient_email
        msg['Subject'] = f"Your Monthly Image - {datetime.now().strftime('%B %Y')}"

        body = "Here's your unique monthly image!"
        msg.attach(MIMEText(body, 'plain'))

        with open(image_path, 'rb') as f:
            img = MIMEImage(f.read())
            img.add_header('Content-Disposition', 'attachment', filename=os.path.basename(image_path))
            msg.attach(img)

        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            server.send_message(msg)

    def run(self):
        """Main execution flow"""
        print(f"Starting monthly task at {datetime.now()}")

        try:
            # Download the image
            downloaded_file = self.download_image()

            # Process each email
            for email in self.email_list:
                try:
                    # Create a copy of the image for this email
                    timestamp = datetime.now().strftime('%Y%m')
                    image_filename = f"{email.split('@')[0]}_{timestamp}{os.path.splitext(downloaded_file)[1]}"
                    image_path = os.path.join(self.output_dir, image_filename)

                    # Copy the downloaded file
                    shutil.copy2(downloaded_file, image_path)

                    # Send the email
                    self.send_email(email, image_path)
                    print(f"Successfully sent image to {email}")

                    # Add delay between emails
                    time.sleep(1)

                except Exception as e:
                    print(f"Error processing {email}: {str(e)}")
                    raise e

        finally:
            # Cleanup downloaded files
            shutil.rmtree(self.download_dir, ignore_errors=True)
            os.makedirs(self.download_dir, exist_ok=True)



if __name__ == "__main__":
    sender = ImageEmailSender()
    sender.run()
