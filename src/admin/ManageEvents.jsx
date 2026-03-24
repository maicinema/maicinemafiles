import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

const FULL_DESCRIPTION = `Join us for the exclusive private screening of the short film The Night We Married. This special event brings together filmmakers, film lovers, and invited guests for an intimate cinematic experience before the film begins streaming online.

After the private screening, the film will begin streaming on Vimeo and on the MaiCinema platform.`;

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPoster, setNewPoster] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createPoster, setCreatePoster] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: FULL_DESCRIPTION,
    venue: "",
    date: "",
    time: "",
    ticketRegular: "",
    ticketVIP: "",
    ticketPremium: ""
  });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("Load events error:", error);
      return;
    }

    const loadedEvents = [];

    for (const event of data || []) {
      const { data: tickets, error: ticketsError } = await supabase
        .from("tickets")
        .select("*")
        .eq("event", event.title);

      if (ticketsError) {
        console.log("Load tickets error:", ticketsError);
      }

      const regularTicket = (tickets || []).find(
        (ticket) => ticket.title === "Regular Ticket"
      );
      const vipTicket = (tickets || []).find(
        (ticket) => ticket.title === "VIP"
      );
      const premiumTicket = (tickets || []).find(
        (ticket) => ticket.title === "Premium"
      );

      loadedEvents.push({
        ...event,
        description: event.description || FULL_DESCRIPTION,
        ticketRegular: regularTicket?.price ?? "",
        ticketVIP: vipTicket?.price ?? "",
        ticketPremium: premiumTicket?.price ?? ""
      });
    }

    setEvents(loadedEvents);
  }

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  async function uploadPoster(file) {
    if (!file) return "";

    const safeName = file.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("posters")
      .upload(fileName, file);

    if (uploadError) {
      console.log("Poster upload error:", uploadError);
      return "";
    }

    const { data } = supabase.storage
      .from("posters")
      .getPublicUrl(fileName);

    return data?.publicUrl || "";
  }

  function getPosterFieldName(event) {
    if ("poster_url" in event) return "poster_url";
    return "poster";
  }

  function getPosterValue(event) {
    return event?.poster_url || event?.poster || "";
  }

  async function createTicketIfValid(eventTitle, ticketTitle, ticketPrice, eventDate) {
    if (ticketPrice === "" || ticketPrice === null || ticketPrice === undefined) {
      return true;
    }

    const numericPrice = parseFloat(ticketPrice);

    if (isNaN(numericPrice)) {
      return true;
    }

    const { error } = await supabase.from("tickets").insert([
      {
        event: eventTitle,
        title: ticketTitle,
        price: numericPrice,
        date: eventDate
      }
    ]);

    if (error) {
      console.log(`Create ${ticketTitle} error:`, error);
      return false;
    }

    return true;
  }

  async function createEvent() {
    try {
      if (!newEvent.title.trim()) {
        alert("Event title is required");
        return;
      }

      let posterUrl = "";
      if (createPoster) {
        posterUrl = await uploadPoster(createPoster);
      }

      const { data: insertedEvent, error: eventError } = await supabase
        .from("events")
        .insert([
          {
            title: newEvent.title,
            description: newEvent.description,
            venue: newEvent.venue,
            date: newEvent.date,
            time: newEvent.time,
            poster: posterUrl
          }
        ])
        .select()
        .single();

      if (eventError) {
        console.log("Create event error:", eventError);
        alert("Event creation failed");
        return;
      }

      const regularOk = await createTicketIfValid(
        newEvent.title,
        "Regular Ticket",
        newEvent.ticketRegular,
        newEvent.date
      );

      const vipOk = await createTicketIfValid(
        newEvent.title,
        "VIP",
        newEvent.ticketVIP,
        newEvent.date
      );

      const premiumOk = await createTicketIfValid(
        newEvent.title,
        "Premium",
        newEvent.ticketPremium,
        newEvent.date
      );

      if (!regularOk || !vipOk || !premiumOk) {
        await supabase.from("events").delete().eq("id", insertedEvent.id);
        await supabase.from("tickets").delete().eq("event", newEvent.title);
        alert("Event creation failed");
        return;
      }

      alert("Event created successfully");

      setShowCreate(false);
      setCreatePoster(null);
      setNewEvent({
        title: "",
        description: FULL_DESCRIPTION,
        venue: "",
        date: "",
        time: "",
        ticketRegular: "",
        ticketVIP: "",
        ticketPremium: ""
      });

      await loadEvents();
    } catch (error) {
      console.log("Create event error:", error);
      alert("Event creation failed");
    }
  }

  const editEvent = (index) => {
    setEditingIndex(index);
    setNewPoster(null);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    const updated = [...events];
    updated[index] = {
      ...updated[index],
      [name]: value
    };

    setEvents(updated);
  };

  async function deleteEvent(id, title) {
    if (!window.confirm("Delete this event?")) return;

    const { error: eventDeleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (eventDeleteError) {
      console.log("Delete event error:", eventDeleteError);
      alert("Failed to delete event");
      return;
    }

    const { error: ticketDeleteError } = await supabase
      .from("tickets")
      .delete()
      .eq("event", title);

    if (ticketDeleteError) {
      console.log("Delete tickets error:", ticketDeleteError);
    }

    await loadEvents();
  }

  async function upsertTicket(eventTitle, ticketTitle, ticketPrice, eventDate) {
    if (ticketPrice === "" || ticketPrice === null || ticketPrice === undefined) {
      return true;
    }

    const numericPrice = parseFloat(ticketPrice);

    if (isNaN(numericPrice)) {
      return true;
    }

    const { data: existingTicket, error: fetchError } = await supabase
      .from("tickets")
      .select("*")
      .eq("event", eventTitle)
      .eq("title", ticketTitle)
      .maybeSingle();

    if (fetchError) {
      console.log("Ticket lookup error:", fetchError);
      return false;
    }

    if (existingTicket) {
      const { error: updateError } = await supabase
        .from("tickets")
        .update({
          price: numericPrice,
          date: eventDate
        })
        .eq("id", existingTicket.id);

      if (updateError) {
        console.log(`Update ${ticketTitle} error:`, updateError);
        return false;
      }
    } else {
      const { error: insertError } = await supabase
        .from("tickets")
        .insert([
          {
            event: eventTitle,
            title: ticketTitle,
            price: numericPrice,
            date: eventDate
          }
        ]);

      if (insertError) {
        console.log(`Insert ${ticketTitle} error:`, insertError);
        return false;
      }
    }

    return true;
  }

  async function saveEvent() {
    const event = events[editingIndex];
    const posterField = getPosterFieldName(event);
    let posterUrl = getPosterValue(event);

    if (newPoster) {
      posterUrl = await uploadPoster(newPoster);
    }

    const eventUpdatePayload = {
      title: event.title,
      description: event.description,
      venue: event.venue,
      date: event.date,
      time: event.time
    };

    eventUpdatePayload[posterField] = posterUrl;

    const { error: eventUpdateError } = await supabase
      .from("events")
      .update(eventUpdatePayload)
      .eq("id", event.id);

    if (eventUpdateError) {
      console.log("Save event error:", eventUpdateError);
      alert("Failed to save event");
      return;
    }

    const regularOk = await upsertTicket(
      event.title,
      "Regular Ticket",
      event.ticketRegular,
      event.date
    );

    const vipOk = await upsertTicket(
      event.title,
      "VIP",
      event.ticketVIP,
      event.date
    );

    const premiumOk = await upsertTicket(
      event.title,
      "Premium",
      event.ticketPremium,
      event.date
    );

    if (!regularOk || !vipOk || !premiumOk) {
      alert("Event saved, but one or more ticket prices failed to update");
    } else {
      alert("Event updated successfully");
    }

    setEditingIndex(null);
    setNewPoster(null);
    await loadEvents();
  }

  return (
    <div style={styles.page}>
      <AdminNavbar />
      <NavigationArrows />

      <div style={styles.container}>
        <h1>Events</h1>

        <button
          onClick={() => setShowCreate(!showCreate)}
          style={styles.addButton}
        >
          + Add Event
        </button>

        {showCreate && (
          <div style={styles.createBox}>
            <input
              name="title"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={handleCreateChange}
              style={styles.input}
            />

            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleCreateChange}
              style={styles.textarea}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCreatePoster(e.target.files[0])}
              style={styles.input}
            />

            <input
              name="venue"
              placeholder="Venue"
              value={newEvent.venue}
              onChange={handleCreateChange}
              style={styles.input}
            />

            <input
              name="date"
              placeholder="Date"
              value={newEvent.date}
              onChange={handleCreateChange}
              style={styles.input}
            />

            <input
              name="time"
              placeholder="Time"
              value={newEvent.time}
              onChange={handleCreateChange}
              style={styles.input}
            />

            <input
              name="ticketRegular"
              placeholder="Regular Price"
              value={newEvent.ticketRegular}
              onChange={handleCreateChange}
              style={styles.input}
            />

            <input
              name="ticketVIP"
              placeholder="VIP Price"
              value={newEvent.ticketVIP}
              onChange={handleCreateChange}
              style={styles.input}
            />

            <input
              name="ticketPremium"
              placeholder="Premium Price"
              value={newEvent.ticketPremium}
              onChange={handleCreateChange}
              style={styles.input}
            />

            <button onClick={createEvent} style={styles.liveButton}>
              Go Live
            </button>
          </div>
        )}

        {events.map((event, index) => (
          <div key={event.id} style={styles.eventCard}>
            {editingIndex === index ? (
              <div style={styles.editBox}>
                <input
                  name="title"
                  value={event.title || ""}
                  onChange={(e) => handleChange(e, index)}
                  style={styles.input}
                />

                <textarea
                  name="description"
                  value={event.description || FULL_DESCRIPTION}
                  onChange={(e) => handleChange(e, index)}
                  style={styles.largeTextarea}
                />

                {getPosterValue(event) && (
                  <img
                    src={getPosterValue(event)}
                    alt="poster"
                    style={styles.poster}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPoster(e.target.files[0])}
                  style={styles.input}
                />

                <input
                  name="venue"
                  value={event.venue || ""}
                  onChange={(e) => handleChange(e, index)}
                  style={styles.input}
                />

                <input
                  name="date"
                  value={event.date || ""}
                  onChange={(e) => handleChange(e, index)}
                  style={styles.input}
                />

                <input
                  name="time"
                  value={event.time || ""}
                  onChange={(e) => handleChange(e, index)}
                  style={styles.input}
                />

                <input
                  name="ticketRegular"
                  placeholder="Regular Price"
                  value={event.ticketRegular || ""}
                  onChange={(e) => handleChange(e, index)}
                  style={styles.input}
                />

                <input
                  name="ticketVIP"
                  placeholder="VIP Price"
                  value={event.ticketVIP || ""}
                  onChange={(e) => handleChange(e, index)}
                  style={styles.input}
                />

                <input
                  name="ticketPremium"
                  placeholder="Premium Price"
                  value={event.ticketPremium || ""}
                  onChange={(e) => handleChange(e, index)}
                  style={styles.input}
                />

                <div style={styles.buttonRow}>
                  <button onClick={saveEvent} style={styles.saveButton}>
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      setNewPoster(null);
                      loadEvents();
                    }}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2>{event.title}</h2>
                <p>{event.date}</p>

                <div style={styles.buttonRow}>
                  <button
                    onClick={() => editEvent(index)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEvent(event.id, event.title)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    minHeight: "100vh"
  },
  container: {
    padding: "40px",
    paddingTop: "120px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  addButton: {
    marginBottom: "20px",
    background: "#e50914",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer"
  },
  createBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "600px",
    width: "100%",
    marginBottom: "40px"
  },
  eventCard: {
    marginBottom: "30px",
    width: "600px"
  },
  editBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%"
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "4px"
  },
  textarea: {
    width: "100%",
    height: "200px",
    padding: "12px",
    border: "none",
    borderRadius: "4px"
  },
  largeTextarea: {
    width: "100%",
    height: "220px",
    padding: "12px",
    border: "none",
    borderRadius: "4px"
  },
  poster: {
    width: "200px",
    borderRadius: "6px"
  },
  buttonRow: {
    display: "flex",
    gap: "10px"
  },
  editButton: {
    background: "#ffffff",
    color: "#000000",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  },
  deleteButton: {
    background: "red",
    color: "white",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  },
  saveButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  },
  cancelButton: {
    background: "#666",
    color: "white",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  },
  liveButton: {
    background: "#e50914",
    color: "white",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  }
};

export default ManageEvents;