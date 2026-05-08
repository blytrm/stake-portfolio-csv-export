# Stake Portfolio CSV
**Export your Stake (hellostake.com) portfolio or holdings table as csv from the website.**
The button lives in the top-right of the page and downloads everything in your holdings table including any extra columns you've enabled via Stake's "Customise" panel as a CSV file.


1. [Tampermonkey](https://tampermonkey.net/) userscript: copy/download the [javascript file](https://github.com/blytrm/stake-portfolio-csv-export/blob/main/export-stake-portfolio-csv.js)
2. Install Tampermonkey onto browser (e.g., via [chrome webstore](https://chromewebstore.google.com/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo?utm_source=item-share-cb))
3. Open Tampermonkey dashboard, paste the script & save
4. Open your Stake portfolio or holdings table on the website
5. Click the red button to download

- Filenames stamped with the current date: stake_portfolio_YYYY-MM-DD.csv
- Survives Stake's SPA navigation, the button re-injects itself if the page rerenders
- Targets *://trading.hellostake.com/*, the AUS platform.
- Will not work on stake.com.au (old domain)

Last tested on Google Chrome & Arc Browser (8/5/2026)
