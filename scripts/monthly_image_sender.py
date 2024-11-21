import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
import random
from PIL import Image, ImageDraw
from datetime import datetime
import yaml
import os

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

        # Create output directory if it doesn't exist
        self.output_dir = 'generated_images'
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_unique_image(self, email):
        """Generate a unique image based on email and current date"""
        width, height = 800, 600
        img = Image.new('RGB', (width, height), self._random_color())
        draw = ImageDraw.Draw(img)

        # Add some random shapes
        for _ in range(5):
            x1 = random.randint(0, width - 50)
            y1 = random.randint(0, height - 50)
            x2 = x1 + 50
            y2 = y1 + 50
            draw.rectangle([x1, y1, x2, y2], fill=self._random_color())

        # Save the image
        timestamp = datetime.now().strftime('%Y%m')  # Changed to monthly format
        filename = f"{self.output_dir}/{email.split('@')[0]}_{timestamp}.png"
        img.save(filename)
        return filename

    def _random_color(self):
        """Generate a random RGB color"""
        return (
            random.randint(0, 255),
            random.randint(0, 255),
            random.randint(0, 255)
        )

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
        """Generate and send images to all emails"""
        print(f"Starting monthly task at {datetime.now()}")
        for email in self.email_list:
            try:
                image_path = self.generate_unique_image(email)
                self.send_email(email, image_path)
                print(f"Successfully sent image to {email}")
            except Exception as e:
                print(f"Error processing {email}: {str(e)}")
                raise e  # Re-raise to fail the GitHub Action

if __name__ == "__main__":
    sender = ImageEmailSender()
    sender.run()
