// ==UserScript==
// @name         Stake Portfolio CSV (hellostake.com)
// @namespace    https://trading.hellostake.com/
// @version      0.3
// @description  Export Stake holdings table to CSV
// @author       Billy Trim
// @match        *://trading.hellostake.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const TAG = '[Stake CSV]';
    console.log(TAG, 'script loaded on', location.href);

    const ROW_SELECTORS = [
        '[data-testid$="holding-table__row"]',
        '.mat-mdc-row',
        'tr[mat-row]',
        '[role="row"].mdc-data-table__row',
    ];
    const ROW_SELECTOR = ROW_SELECTORS.join(', ');
    const HEADER_ROW_SELECTOR = '.mat-mdc-header-row, tr[mat-header-row], [role="row"].mdc-data-table__header-row';

    function csvField(v) {
        const s = (v == null ? '' : String(v)).replace(/\s+/g, ' ').trim();
        return `"${s.replace(/"/g, '""')}"`;
    }

    function downloadCSV(rows) {
        const csv = rows.map(r => r.map(csvField).join(',')).join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const ts = new Date().toISOString().slice(0, 10);
        link.href = url;
        link.download = `stake_portfolio_${ts}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function getColumnId(cell) {
        const cls = Array.from(cell.classList).find(c => c.startsWith('cdk-column-'));
        return cls ? cls.replace('cdk-column-', '') : '';
    }

    function scrape() {
        const dataRows = Array.from(document.querySelectorAll(ROW_SELECTOR));
        console.log(TAG, 'rows found:', dataRows.length);
        if (!dataRows.length) {
            alert('Stake CSV: no holding rows found. Make sure the holdings table is visible on the page.');
            return null;
        }

        const firstCells = dataRows[0].querySelectorAll('[class*="cdk-column-"]');
        const columns = Array.from(firstCells)
            .map(getColumnId)
            .filter(id => id && id !== 'filler');
        console.log(TAG, 'columns detected:', columns);

        const headerRow = document.querySelector(HEADER_ROW_SELECTOR);
        const headers = columns.map(col => {
            if (headerRow) {
                const hCell = headerRow.querySelector('.cdk-column-' + CSS.escape(col));
                const txt = hCell?.innerText.trim();
                if (txt) return txt;
            }
            return col;
        });

        const data = dataRows.map(row =>
            columns.map(col => {
                const cell = row.querySelector('.cdk-column-' + CSS.escape(col));
                return cell ? cell.innerText.trim().replace(/\s+/g, ' ') : '';
            })
        );

        return [headers, ...data];
    }

    function ensureButton() {
        if (document.getElementById('export_portfolio_csv')) return;
        if (!document.body) return; // body not ready yet
        const btn = document.createElement('button');
        btn.id = 'export_portfolio_csv';
        btn.textContent = '⬇ Export Portfolio CSV';
        btn.style.cssText = [
            'all: unset',
            'cursor: pointer',
            'background: #e84142',
            'color: #fff',
            'border: 2px solid #fff',
            'border-radius: 8px',
            'padding: 10px 16px',
            'font-family: sans-serif',
            'font-size: 14px',
            'font-weight: 600',
            'position: fixed',
            'top: 100px',
            'right: 24px',
            'z-index: 2147483647',
            'box-shadow: 0 4px 12px rgba(0,0,0,0.4)',
        ].join(';');
        btn.addEventListener('click', () => {
            const rows = scrape();
            if (rows && rows.length > 1) downloadCSV(rows);
        });
        document.body.appendChild(btn);
        console.log(TAG, 'button injected');
    }

    // Inject the button as soon as <body> exists, then keep it alive across SPA re-renders.
    function start() {
        ensureButton();
        const obs = new MutationObserver(() => ensureButton());
        obs.observe(document.documentElement, { childList: true, subtree: true });
    }

    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
})();