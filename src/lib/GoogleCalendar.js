import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export const initGoogleAPI = () =>
  new Promise((resolve, reject) => {
    // ✅ Wait until gapi exists in window
    const waitForGapi = () => {
      if (window.gapi?.load) {
        gapi.load('client:auth2', async () => {
          try {
            await gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: DISCOVERY_DOCS,
              scope: SCOPES,
            });

            const auth = gapi.auth2.getAuthInstance();
            if (!auth) {
              reject(new Error('Google Auth instance is null'));
              return;
            }

            resolve(auth);
          } catch (err) {
            reject(err);
          }
        });
      } else {
        setTimeout(waitForGapi, 100);
      }
    };

    waitForGapi();
  });

export const createCalendarEvent = async (meeting) => {
  const event = {
    summary: meeting.title,
    description: meeting.description,
    start: {
      dateTime: `${meeting.date}T${meeting.time}:00`,
      timeZone: 'Africa/Johannesburg',
    },
    end: {
      dateTime: `${meeting.date}T${meeting.time}:00`, // adjust with real duration if needed
      timeZone: 'Africa/Johannesburg',
    },
    attendees:
      meeting.participants
        ?.split(',')
        .map((email) => ({ email: email.trim() })) || [],
  };

  try {
    await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    return true;
  } catch (error) {
    console.error('Error creating Google Calendar event', error);
    return false;
  }
};

export const listCalendarEvents = async () => {
  const gapi = window.gapi;

  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    });

    return response.result.items;
  } catch (err) {
    console.error('Failed to list events:', err);
    throw err;
  }
};
