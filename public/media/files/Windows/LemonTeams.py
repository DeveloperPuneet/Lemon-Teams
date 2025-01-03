import sys
import requests
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QHBoxLayout, QLabel, QPushButton, QSystemTrayIcon, QMenu, QAction
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl, Qt
from PyQt5.QtGui import QIcon
from PyQt5.QtCore import QBuffer, QByteArray


# Function to download the image and save it locally
def download_image(url, save_path):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            with open(save_path, 'wb') as file:
                file.write(response.content)
        else:
            print("Failed to download the image")
    except Exception as e:
        print(f"Error downloading image: {e}")


class CustomTitleBar(QWidget):
    def __init__(self):
        super().__init__()

        # Set the title bar color to match Lemon Teams text background color
        self.setFixedHeight(30)  # Set fixed height for the title bar
        self.setStyleSheet("""
            background-color: #181818;
            color: #ffffff;
            margin: 0px;
            padding: 0px;
        """)

        # Layout for the title bar
        layout = QHBoxLayout()
        self.label = QLabel("Lemon Teams")
        self.label.setStyleSheet("color: #ffffff; font-size: 14px; margin: 0px; padding: 0px;")
        
        # Add minimize, maximize, close buttons
        self.min_button = QPushButton("-")
        self.min_button.setFixedSize(30, 30)  # Set fixed size for the buttons
        self.min_button.setStyleSheet("""
            background-color: #4CAF50; 
            color: white; 
            font-size: 14px; 
            text-align: center; 
            border: none; 
            padding: 0px;
        """)  # Green color for minimize
        self.min_button.clicked.connect(self.minimize_window)
        
        self.max_button = QPushButton("□")
        self.max_button.setFixedSize(30, 30)  # Set fixed size for the buttons
        self.max_button.setStyleSheet("""
            background-color: #FF9800; 
            color: white; 
            font-size: 14px; 
            text-align: center; 
            border: none; 
            padding: 0px;
        """)  # Orange color for maximize
        self.max_button.clicked.connect(self.maximize_window)

        self.close_button = QPushButton("X")
        self.close_button.setFixedSize(30, 30)  # Set fixed size for the buttons
        self.close_button.setStyleSheet("""
            background-color: #F44336; 
            color: white; 
            font-size: 14px; 
            text-align: center; 
            border: none; 
            padding: 0px;
        """)  # Red color for close
        self.close_button.clicked.connect(self.close_window)
        
        # Adding widgets to the title bar layout
        layout.addWidget(self.label)
        layout.addWidget(self.min_button)
        layout.addWidget(self.max_button)
        layout.addWidget(self.close_button)
        
        self.setLayout(layout)
    
    def minimize_window(self):
        self.window().showMinimized()

    def maximize_window(self):
        if self.window().isMaximized():
            self.window().showNormal()
        else:
            self.window().showMaximized()

    def close_window(self):
        self.window().close()


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Set the minimum size of the window
        self.setMinimumSize(150, 150)

        # Set the window title to "Lemon Teams"
        self.setWindowTitle("Lemon Teams")

        # Download the logo from the URL and save it locally
        logo_url = "https://lemonteams.onrender.com/Emblem/Emblem.jpeg"
        logo_path = "Emblem.jpeg"  # Local path for saving the logo
        download_image(logo_url, logo_path)

        # Set the window icon using the locally saved image
        self.setWindowIcon(QIcon(logo_path))

        # Create the main layout
        main_layout = QVBoxLayout()

        # Create a custom title bar and add it to the window
        title_bar = CustomTitleBar()
        main_layout.addWidget(title_bar)

        # Add the web view
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl("https://lemonteams.onrender.com"))
        main_layout.addWidget(self.browser)

        # Create a central widget and set the layout
        central_widget = QWidget()
        central_widget.setLayout(main_layout)
        self.setCentralWidget(central_widget)

        # Remove the default title bar and window borders (frameless window)
        self.setWindowFlag(Qt.FramelessWindowHint)

        # Ensure no shadow or border
        self.setAttribute(Qt.WA_OpaquePaintEvent)

        # Remove the window border and make the background color of the window #181818
        self.setStyleSheet("background: #181818; border: none; padding: none;")

        # Start maximized
        self.showMaximized()

        # Setup the system tray icon
        self.setup_tray_icon(logo_path)

    def mousePressEvent(self, event):
        """Enable dragging of the custom title bar."""
        if event.button() == Qt.LeftButton:
            self.drag_position = event.globalPos() - self.frameGeometry().topLeft()
            event.accept()

    def mouseMoveEvent(self, event):
        """Handle dragging of the window."""
        if event.buttons() == Qt.LeftButton:
            self.move(event.globalPos() - self.drag_position)
            event.accept()

    def setup_tray_icon(self, logo_path):
        """Setup system tray icon."""
        tray_icon = QSystemTrayIcon(QIcon(logo_path), self)

        # Create a menu for the system tray icon
        tray_menu = QMenu()
        
        # Add exit action to the tray icon menu
        exit_action = QAction("Exit", self)
        exit_action.triggered.connect(self.close)
        tray_menu.addAction(exit_action)

        tray_icon.setContextMenu(tray_menu)
        tray_icon.show()

    def closeEvent(self, event):
        """Handle close event, ensure to quit the application when closing."""
        QApplication.quit()


# Run the application
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

# pyinstaller --onefile --windowed --icon-Emblem.jpeg LemonTeams.py