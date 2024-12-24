import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getEvents } from '../utils/firebase.ts';
import { Event } from '../types';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const CalendarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const EventDate = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 0.5rem 1rem;
  font-weight: bold;
`;

const EventContent = styled.div`
  padding: 1rem;
`;

const EventName = styled.h3`
  margin: 0 0 1rem 0;
  color: ${(props) => props.theme.colors.text};
`;

const EventInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.textLight};

  svg {
    margin-right: 0.5rem;
  }
`;

const EventCard = styled.div<{ isPast: boolean }>`
  background-color: ${(props) => (props.isPast ? '#f5f5f5' : 'white')};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
  opacity: ${(props) => (props.isPast ? 0.6 : 1)};

  &:hover {
    transform: ${(props) => (props.isPast ? 'none' : 'translateY(-5px)')};
  }
`;

const PastEventBadge = styled.div`
  background-color: #dc3545;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.colors.textLight};
  font-size: 1.2rem;
`;

const formatDate = (dateString: string) => {
  if (!dateString) return 'Date not set';
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatTime = (timeString: string | undefined) => {
  if (!timeString) return 'Time not set';
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

const isEventPast = (eventDate: string, eventEndTime: string) => {
  const now = new Date();
  const eventDateTime = new Date(eventDate);

  // Set the event time
  if (eventEndTime) {
    const [hours, minutes] = eventEndTime.split(':');
    eventDateTime.setHours(parseInt(hours, 10));
    eventDateTime.setMinutes(parseInt(minutes, 10));
  }

  return eventDateTime < now;
};

const isCurrentMonth = (dateString: string) => {
  const eventDate = new Date(dateString);
  const now = new Date();
  return (
    eventDate.getMonth() === now.getMonth() &&
    eventDate.getFullYear() === now.getFullYear()
  );
};

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getEvents();

      // Sort events chronologically
      const sortedEvents = fetchedEvents.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.startTime);
        const dateB = new Date(b.date + 'T' + b.startTime);
        return dateA.getTime() - dateB.getTime();
      });

      setEvents(sortedEvents);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events for current month
    const currentMonthEvents = events.filter((event) =>
      isCurrentMonth(event.date)
    );
    setFilteredEvents(currentMonthEvents);
  }, [events]);

  if (filteredEvents.length === 0) {
    return (
      <CalendarContainer>
        <h1>Upcoming Events</h1>
        <NoEventsMessage>No events scheduled for this month.</NoEventsMessage>
      </CalendarContainer>
    );
  }

  return (
    <CalendarContainer>
      <h1>Upcoming Events</h1>
      <EventGrid>
        {filteredEvents.map((event) => {
          const isPast = isEventPast(event.date, event.endTime);

          return (
            <EventCard key={event.id} isPast={isPast}>
              <EventDate>{formatDate(event.date)}</EventDate>
              <EventContent>
                {isPast && <PastEventBadge>Event Ended</PastEventBadge>}
                <EventName>{event.name}</EventName>
                <EventInfo>
                  <FaClock />
                  {event.startTime && event.endTime
                    ? `${formatTime(event.startTime)} - ${formatTime(
                        event.endTime
                      )}`
                    : 'Time not set'}
                </EventInfo>
                <EventInfo>
                  <FaMapMarkerAlt />
                  {event.location || 'Location not set'}
                </EventInfo>
              </EventContent>
            </EventCard>
          );
        })}
      </EventGrid>
    </CalendarContainer>
  );
};
