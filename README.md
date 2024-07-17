# Project Name

## Getting Started with Google Apps Script and `clasp`

This project utilizes Google Apps Script to automate various tasks within Google Workspace. To manage and deploy the scripts, we use the `clasp` (Command Line Apps Script) tool.

### Prerequisites

Before getting started, make sure you have the following installed:

- Node.js (v12 or later)
- npm (Node Package Manager)

### Setup Instructions

Follow these steps to set up and deploy the project using `clasp`:

1. **Clone the Repository**

    Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. **Install `clasp`**

    Install `clasp` globally using npm:

    ```bash
    npm install -g @google/clasp
    ```

    Alternatively, you can use the provided Makefile command:

    ```bash
    make install
    ```

3. **Log in to Your Google Account**

    Authenticate `clasp` with your Google account:

    ```bash
    clasp login
    ```

4. **Create a Google Apps Script Project**

    Create a new project or clone an existing one:

    ```bash
    clasp create --type standalone
    ```

    If you are working with an existing project, set up `clasp` to use it:

    ```bash
    clasp clone <scriptId>
    ```

5. **Deploy the Project**

    To deploy your project, run the following command:

    ```bash
    clasp push
    ```

    Or use the provided Makefile command:

    ```bash
    make deploy
    ```

    This command will push your local code to the Google Apps Script project and deploy it.

6. **Create the Trigger through the Google Apps Script UI**

    - Go to the Google Apps Script Editor: `https://script.google.com/d/<your-script-id>/edit` (replace `<your-script-id>` with your actual script ID).
    - Click on the clock icon in the toolbar to open the Triggers page.
    - Click on "Add Trigger" in the bottom-right corner.
    - Set up the trigger with the following settings:
        - Choose which function to run: `onEventChange`
        - Select event source: `From calendar`
        - Select type of time-based trigger: `On event updated`
        - Select calendar: `Your calendar ID`
    - Click "Save" to create the trigger.

7. **Set the OpenAI API Key in Script Properties**

    - Go to the Google Apps Script Editor: `https://script.google.com/d/<your-script-id>/edit` (replace `<your-script-id>` with your actual script ID).
    - Click on `File` -> `Project properties`.
    - Navigate to the `Script properties` tab.
    - Click `Add row`.
    - Set `Name` to `OPENAI_API_KEY` and `Value` to your actual OpenAI API key.
    - Click `Save` to store the API key.

### Project Structure

The source code for the project is located in the `src` directory. The Makefile includes several commands to help manage the project:

- `make install`: Installs `clasp` globally.
- `make deploy`: Deploys the project using `clasp push`.

### Help Command

The default goal of the Makefile is `help`. You can view the available commands by running:

```bash
make help
