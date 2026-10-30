# Little Smiles Clinic

A responsive clinic workspace for Dr. Visnu P.’s pediatric dental clinic.

## Open the app

Double-click Run Little Smiles.bat. Leave its window open while using the app. It opens at http://127.0.0.1:4173. Node.js must be installed.

## Connect Gemini for flexible answers

1. In the app, open AI assistant.
2. Choose Get a free Gemini key. Create one in Google AI Studio.
3. Paste the key into the password field and choose Save key on this computer.

The local server saves the key in a private .env file, which is blocked from browser access and excluded from Git. The key is never included in page code. Without a key, the clinic guide still answers from the saved clinic information.

The assistant uses Gemini 3.1 Flash-Lite. Google currently lists free-tier use for this model, subject to account and rate limits; confirm current availability in the official model list and pricing page:
- https://ai.google.dev/gemini-api/docs/models
- https://ai.google.dev/gemini-api/docs/pricing

Gemini free-tier messages may be used by Google to improve its services. Do not enter real patient names, contact details, symptoms, or health history. This assistant does not diagnose or recommend treatment.

## Appointments and clinic details

The timetable shows suggested 30-minute times. Update the clinic hours and block times in Team desk, then confirm the real schedule before accepting visits. Appointment requests and team messages are saved in the current browser only; staff are not notified and no payment is collected. Connect a booking service before using this as a live clinic system.