
export const mockConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "SJ",
    online: true,
    unread: 2,
    lastMessage: "That sounds great! See you tomorrow.",
    time: "10:42 AM",
    messages: [
      {
        id: 101,
        text: "Hey! How are you doing?",
        time: "10:35 AM",
        sender: "them",
      },
      {
        id: 102,
        text: "I'm doing well, thanks! How about you?",
        time: "10:37 AM",
        sender: "me",
      },
      {
        id: 103,
        text: "I'm great! Are we still meeting tomorrow?",
        time: "10:40 AM",
        sender: "them",
      },
      {
        id: 104,
        text: "Yes, absolutely. What time works for you?",
        time: "10:41 AM",
        sender: "me",
      },
      {
        id: 105,
        text: "That sounds great! See you tomorrow.",
        time: "10:42 AM",
        sender: "them",
      },
    ],
  },
  {
    id: 2,
    name: "Michael Davis",
    avatar: "MD",
    online: true,
    unread: 0,
    lastMessage: "Thank you for your help.",
    time: "9:18 AM",
    messages: [
      {
        id: 201,
        text: "Could you help me with something?",
        time: "9:15 AM",
        sender: "them",
      },
      {
        id: 202,
        text: "Of course! What do you need help with?",
        time: "9:16 AM",
        sender: "me",
      },
      {
        id: 203,
        text: "Thank you for your help.",
        time: "9:18 AM",
        sender: "them",
      },
    ],
  },
  {
    id: 3,
    name: "Emily Wilson",
    avatar: "EW",
    online: false,
    unread: 0,
    lastMessage: "I'll send you the details.",
    time: "Yesterday",
    messages: [
      {
        id: 301,
        text: "I'll send you the details.",
        time: "Yesterday",
        sender: "them",
      },
    ],
  },
  {
    id: 4,
    name: "David Thompson",
    avatar: "DT",
    online: true,
    unread: 1,
    lastMessage: "Are you available this afternoon?",
    time: "Yesterday",
    messages: [
      {
        id: 401,
        text: "Are you available this afternoon?",
        time: "Yesterday",
        sender: "them",
      },
    ],
  },
];
