import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TicketDetail } from './components/TicketDetail';
import { CreateTicket } from './components/CreateTicket';

export type TicketStatus = 'urgent' | 'en_cours' | 'resolu' | 'assigne';
export type TicketPriority = 'critique' | 'haute' | 'normale' | 'basse';
export type UserRole = 'technicien_senior' | 'technicien_junior' | 'technicien_itinerant' | 'cheffe_support';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  available: boolean;
  workload: number; // 0-100%
}

export interface TicketComment {
  id: string;
  author: string;
  timestamp: Date;
  content: string;
  type: 'comment' | 'status_change' | 'assignment';
}

export interface TicketAttachment {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string;
  uploadedBy: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  subcategory?: string;
  assignedTo?: string;
  assignedTech?: string;
  createdAt: Date;
  updatedAt: Date;
  comments: TicketComment[];
  attachments: TicketAttachment[];
  estimatedTime?: number;
  location?: string;
  equipment?: string;
}

export type Screen = 'dashboard' | 'ticket-detail' | 'create-ticket';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Données d'exemple
  const [users] = useState<User[]>([
    { id: '1', name: 'Marie Dubois', role: 'cheffe_support', available: true, workload: 75 },
    { id: '2', name: 'Thomas Martin', role: 'technicien_senior', available: true, workload: 60 },
    { id: '3', name: 'Sophie Laurent', role: 'technicien_junior', available: true, workload: 40 },
    { id: '4', name: 'Julien Moreau', role: 'technicien_itinerant', available: false, workload: 90 },
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'T-001',
      clientId: 'CLI-123',
      clientName: 'Entreprise ABC',
      title: 'Serveur principal inaccessible',
      description: 'Le serveur principal ne répond plus depuis ce matin, impact critique sur la production.',
      status: 'urgent',
      priority: 'critique',
      category: 'Infrastructure',
      subcategory: 'Serveurs',
      assignedTo: '2',
      assignedTech: 'Thomas Martin',
      createdAt: new Date('2024-01-15T08:30:00'),
      updatedAt: new Date('2024-01-15T09:15:00'),
      comments: [
        {
          id: 'c1',
          author: 'Marie Dubois',
          timestamp: new Date('2024-01-15T08:35:00'),
          content: 'Ticket escaladé en urgence, Thomas prend en charge immédiatement.',
          type: 'assignment'
        }
      ],
      attachments: [],
      estimatedTime: 4,
      location: 'Datacenter A',
      equipment: 'Dell PowerEdge R740'
    },
    {
      id: 'T-002',
      clientId: 'CLI-456',
      clientName: 'Startup XYZ',
      title: 'Problème réseau Wi-Fi bureau',
      description: 'Connexion Wi-Fi instable dans les bureaux du 2ème étage.',
      status: 'en_cours',
      priority: 'normale',
      category: 'Réseau',
      subcategory: 'Wi-Fi',
      assignedTo: '3',
      assignedTech: 'Sophie Laurent',
      createdAt: new Date('2024-01-14T14:20:00'),
      updatedAt: new Date('2024-01-15T10:00:00'),
      comments: [
        {
          id: 'c2',
          author: 'Sophie Laurent',
          timestamp: new Date('2024-01-15T10:00:00'),
          content: 'Diagnostic en cours, problème identifié sur le point d\'accès AP-02.',
          type: 'comment'
        }
      ],
      attachments: [],
      estimatedTime: 2,
      location: 'Bureau étage 2'
    },
    {
      id: 'T-003',
      clientId: 'CLI-789',
      clientName: 'Groupe DEF',
      title: 'Mise à jour logiciel comptabilité',
      description: 'Planifier la mise à jour du logiciel de comptabilité vers la version 2024.',
      status: 'assigne',
      priority: 'basse',
      category: 'Logiciels',
      subcategory: 'Mise à jour',
      assignedTo: '2',
      assignedTech: 'Thomas Martin',
      createdAt: new Date('2024-01-10T16:00:00'),
      updatedAt: new Date('2024-01-12T09:00:00'),
      comments: [],
      attachments: [],
      estimatedTime: 6,
      location: 'Bureau comptabilité'
    }
  ]);

  const handleNavigate = (screen: Screen, ticketId?: string) => {
    setCurrentScreen(screen);
    if (ticketId) {
      setSelectedTicketId(ticketId);
    }
  };

  const handleCreateTicket = (ticketData: Partial<Ticket>) => {
    const newTicket: Ticket = {
      id: `T-${String(tickets.length + 1).padStart(3, '0')}`,
      clientId: ticketData.clientId || '',
      clientName: ticketData.clientName || '',
      title: ticketData.title || '',
      description: ticketData.description || '',
      status: 'assigne',
      priority: ticketData.priority || 'normale',
      category: ticketData.category || '',
      subcategory: ticketData.subcategory,
      assignedTo: ticketData.assignedTo,
      assignedTech: users.find(u => u.id === ticketData.assignedTo)?.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      attachments: [],
      estimatedTime: ticketData.estimatedTime,
      location: ticketData.location,
      equipment: ticketData.equipment
    };

    setTickets(prev => [...prev, newTicket]);
    setCurrentScreen('dashboard');
  };

  const handleUpdateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, ...updates, updatedAt: new Date() }
        : ticket
    ));
  };

  const handleAddComment = (ticketId: string, content: string) => {
    const newComment: TicketComment = {
      id: `c${Date.now()}`,
      author: 'Utilisateur Actuel',
      timestamp: new Date(),
      content,
      type: 'comment'
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            comments: [...ticket.comments, newComment],
            updatedAt: new Date()
          }
        : ticket
    ));
  };

  const handleAddAttachment = (ticketId: string, file: File) => {
    const newAttachment: TicketAttachment = {
      id: `att${Date.now()}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      url: URL.createObjectURL(file),
      uploadedBy: 'Utilisateur Actuel',
      timestamp: new Date()
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            attachments: [...ticket.attachments, newAttachment],
            updatedAt: new Date()
          }
        : ticket
    ));
  };

  const selectedTicket = selectedTicketId ? tickets.find(t => t.id === selectedTicketId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'dashboard' && (
        <Dashboard 
          tickets={tickets}
          users={users}
          onNavigate={handleNavigate}
          onUpdateTicket={handleUpdateTicket}
        />
      )}
      
      {currentScreen === 'ticket-detail' && selectedTicket && (
        <TicketDetail 
          ticket={selectedTicket}
          users={users}
          onNavigate={handleNavigate}
          onUpdateTicket={handleUpdateTicket}
          onAddComment={handleAddComment}
          onAddAttachment={handleAddAttachment}
        />
      )}
      
      {currentScreen === 'create-ticket' && (
        <CreateTicket 
          users={users}
          onNavigate={handleNavigate}
          onCreateTicket={handleCreateTicket}
        />
      )}
    </div>
  );
}