# Dungeons and Portals Game

## Purpose:

The Dungeons & Portals Game is designed to differentiate between clinical populations with behavioral compulsions and healthy control (HC) populations.

The game tracks the player's ability to accurately model cost-benefit in complex-deterministic environments, and to make rational choices to maximize game rewards. 

Deviations from expected behavior may indicate an inability to correctly model cost-benefit of complex decisions. Correlation between irrational behavioral choices and behavioral compulsions may suggest that the inability to correctly model complex environments underlies behavioral compulsions in clinical populations.

## Gameplay Overview:

The player is presented with two options in the game:

- **Option A:** High reward, high cost - always results in a net negative point balance.

- **Option B:** Moderate reward, no cost - always results in a net positive point balance.

## Description:

### Instructions and Practice Rounds:

The player is guided through a set of written instructions on how to play the game.
This is followed by a set of practice rounds to familiarize the player with the mechanics.

### Main Gameplay:

- The game begins on the Home Screen, where the player chooses to enter one of two dungeons.
- Unknown to the player, these dungeons correspond to Option A (high reward, high cost) and Option B (moderate reward, no cost).
- Upon entering a dungeon, the player earns a certain number of points.
- Each dungeon contains portals, with the goal of finding a way to the "escape" door.
- The player navigates through these portals, which teleport them to different sections of the dungeon, until they reach the escape door.
- Depending on whether the dungeon represents Option A or B, the portals may cause the player to lose points.
- Once the player escapes the dungeon, they return to the Home Screen to make another choice.

### Objective:

- Throughout the game, the player monitors their point balance to determine the best dungeon to enter.
- The game consists of a set number of rounds (e.g. 10 rounds total).
- Over multiple rounds, the player may develop a preference for a particular dungeon.

### Analysis:

Player behavior and preferences are mapped to Bayesian inference models to discern group-level differences between HC populations and clinical behavioral compulsion groups. 

## Deployment using Render

### 1. **Prepare Your Repository**
Ensure the application has the following Flask files:
- `app.py` (or your main Flask file)
- `requirements.txt` (listing all dependencies)
- Any additional required files (e.g., `templates/`, `static/`)

### 2. **Push to GitHub**
If your code is not already in a GitHub repository, initialize one and push your changes:
```sh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 3. **Create a New Web Service on Render**
1. Go to [[Render Dashboard](https://dashboard.render.com/)](https://dashboard.render.com/).
2. Click **New Web Service**.
3. Connect your GitHub repository.
4. Select your branch (usually `main`).

### 4. **Set Environment Variables**
1. Go to the **Environment Variables** section.
2. Add the following variable:
   ```plaintext
   Key: FLASK_ENV
   Value: production
   ```

### 5. **Configure Build and Start Commands**
- **Build Command:**
  ```sh
  pip install -r requirements.txt
  ```
- **Start Command:**
  ```sh
  python app.py
  ```

### 6. **Ensure Flask Binds to the Correct Host and Port**
Modify `app.py` to use the `PORT` environment variable:
```python
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Use Render's assigned port
    app.run(host="0.0.0.0", port=port, debug=False)
```

### 7. **Deploy and Test**
- Click **Deploy** on Render.
- Wait for the deployment to complete.
- Once deployed, visit the provided URL to test your Flask app.

### 8. **Troubleshooting**
If deployment fails, check:
- Render’s **logs** for errors.
- The correct **host and port binding** in `app.py`.
- That **all dependencies** are listed in `requirements.txt`.

## Contributing:

### Submit a pull request

If you'd like to contribute, please fork the repository and open a pull request to the `main` branch.
