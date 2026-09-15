<template>
  <div class="messages-page">

    <!-- Page Header -->
    <div class="page-heading">
      <div>
        <h1>Messages</h1>
        <p>View and manage system messages.</p>
      </div>

      <button class="primary-btn" @click="showAddForm = !showAddForm">
        <i class="bi bi-pencil-square"></i>
        New Message
      </button>
    </div>

    <!-- New Message Form -->
    <transition name="slide-fade">
      <div v-if="showAddForm" class="add-message-form">

        <div class="form-header">
          <div class="form-icon">
            <i class="bi bi-envelope-plus"></i>
          </div>

          <div>
            <h3>New Message</h3>
            <p>Send a new message to the system.</p>
          </div>
        </div>

        <div class="form-grid">

          <div class="form-group">
            <label>Sender Name</label>
            <div class="input-wrapper">
              <i class="bi bi-person"></i>
              <input
                v-model="newMessage.sender"
                type="text"
                placeholder="Enter sender name"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Subject</label>
            <div class="input-wrapper">
              <i class="bi bi-chat-left-text"></i>
              <input
                v-model="newMessage.subject"
                type="text"
                placeholder="Enter message subject"
              />
            </div>
          </div>

        </div>

        <div class="form-group">
          <label>Message</label>
          <div class="textarea-wrapper">
            <textarea
              v-model="newMessage.body"
              placeholder="Write your message here..."
              rows="5"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button class="secondary-btn" @click="cancelAdd">
            Cancel
          </button>

          <button class="primary-btn" @click="addMessage">
            <i class="bi bi-send"></i>
            Send Message
          </button>
        </div>

      </div>
    </transition>

    <!-- Messages -->
    <div class="message-list">

      <div
        v-for="message in messages"
        :key="message.id"
        class="message-card"
        :class="{ unread: message.unread }"
      >

        <div class="message-avatar">
          {{ message.sender ? message.sender.charAt(0).toUpperCase() : 'M' }}
        </div>

        <div class="message-content">

          <div class="message-top">
            <div class="sender-info">
              <strong>{{ message.sender }}</strong>

              <span v-if="message.unread" class="new-label">
                New
              </span>
            </div>

            <small>
              <i class="bi bi-clock"></i>
              {{ message.time }}
            </small>
          </div>

          <h4>{{ message.subject }}</h4>

          <p>{{ message.body }}</p>

        </div>

        <div class="message-actions">

          <span v-if="message.unread" class="unread-dot"></span>

          <button
            class="delete-btn"
            title="Delete message forever"
            @click="deleteMessageForever(message.id)"
          >
            <i class="bi bi-trash3"></i>
          </button>

        </div>

      </div>

      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-envelope"></i>
        </div>

        <h3>No messages</h3>
        <p>There are currently no messages to show.</p>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "Messages",

  data() {
    return {
      showAddForm: false,

      newMessage: {
        sender: "",
        subject: "",
        body: "",
      },

      messages: [],
      nextId: 1,
    };
  },

  // ដំណើរការដំបូងពេល Component ត្រូវបានបង្កើតឡើង
  created() {
    this.loadMessages();
  },

  methods: {
    // មុខងារទាញយកទិន្នន័យពី localStorage
    loadMessages() {
      const storedMessages = localStorage.getItem("system_messages");
      const storedNextId = localStorage.getItem("system_messages_next_id");

      if (storedMessages) {
        this.messages = JSON.parse(storedMessages);
      } else {
        // បើគ្មានទិន្នន័យក្នុងម៉ាស៊ីនទេ វានឹងបង្កើតទិន្នន័យគំរូដំបូង
        this.messages = [
          {
            id: 1,
            sender: "John Smith",
            time: "10 minutes ago",
            subject: "Attendance Question",
            body: "I would like to ask about my attendance record.",
            unread: true,
          },
          {
            id: 2,
            sender: "Emma Wilson",
            time: "1 hour ago",
            subject: "Class Schedule",
            body: "Can you confirm tomorrow's class schedule?",
            unread: false,
          },
        ];
        this.saveToStorage();
      }

      if (storedNextId) {
        this.nextId = parseInt(storedNextId, 10);
      } else {
        this.nextId = this.messages.length ? Math.max(...this.messages.map(m => m.id)) + 1 : 1;
        localStorage.setItem("system_messages_next_id", this.nextId);
      }
    },

    // មុខងាររក្សាទុកទិន្នន័យចូល localStorage
    saveToStorage() {
      localStorage.setItem("system_messages", JSON.stringify(this.messages));
      localStorage.setItem("system_messages_next_id", this.nextId);
    },

    // មុខងារបន្ថែមសារថ្មី
    addMessage() {
      if (
        !this.newMessage.sender.trim() ||
        !this.newMessage.subject.trim()
      ) {
        return;
      }

      this.messages.unshift({
        id: this.nextId++,
        sender: this.newMessage.sender.trim(),
        time: "Just now",
        subject: this.newMessage.subject.trim(),
        body: this.newMessage.body.trim(),
        unread: false,
      });

      // រក្សាទុកចូល Storage ភ្លាមៗ
      this.saveToStorage();
      this.cancelAdd();
    },

    cancelAdd() {
      this.newMessage = {
        sender: "",
        subject: "",
        body: "",
      };

      this.showAddForm = false;
    },

    // មុខងារលុបសារចោលជារៀងរហូត
    deleteMessageForever(id) {
      if (confirm("Are you sure you want to delete this message forever?")) {
        this.messages = this.messages.filter((m) => m.id !== id);
        // រក្សាទុកការផ្លាស់ប្តូរចូល Storage ភ្លាមៗ
        this.saveToStorage();
      }
    },
  },
};
</script>

<style scoped>

/* =========================
   PAGE
========================= */

.messages-page {
  width: 100%;
  padding: 28px;
  box-sizing: border-box;
  color: #1e293b;
}

/* =========================
   HEADER
========================= */

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-heading h1 {
  margin: 0 0 5px;
  font-size: 26px;
  font-weight: 700;
  color: #172033;
}

.page-heading p {
  margin: 0;
  color: #7b8494;
  font-size: 14px;
}

/* =========================
   BUTTONS
========================= */

.primary-btn,
.secondary-btn {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.primary-btn {
  background: #2563eb;
  color: white;
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.2);
}

.primary-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.secondary-btn {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.secondary-btn:hover {
  background: #e2e8f0;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  color: #ef4444;
  background: #fef2f2;
}

/* =========================
   ADD MESSAGE FORM
========================= */

.add-message-form {
  background: #ffffff;
  border: 1px solid #e5eaf0;
  border-radius: 12px;
  padding: 22px;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 13px;
  padding-bottom: 18px;
  margin-bottom: 20px;
  border-bottom: 1px solid #edf0f4;
}

.form-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.form-header h3 {
  margin: 0 0 3px;
  font-size: 16px;
  color: #172033;
}

.form-header p {
  margin: 0;
  color: #8a93a3;
  font-size: 13px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 15px;
}

/* =========================
   FORM FIELDS
========================= */

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 17px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #9aa3b2;
  font-size: 15px;
}

.input-wrapper input,
.textarea-wrapper textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dce2e9;
  border-radius: 8px;
  background: #fff;
  color: #1f2937;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.input-wrapper input {
  height: 42px;
  padding: 0 13px 0 38px;
}

.textarea-wrapper textarea {
  padding: 12px 13px;
  resize: vertical;
  min-height: 110px;
  font-family: inherit;
  line-height: 1.5;
}

.input-wrapper input:focus,
.textarea-wrapper textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.input-wrapper input::placeholder,
.textarea-wrapper textarea::placeholder {
  color: #94a3b8;
}

/* =========================
   MESSAGE LIST & CARDS
========================= */

</style>