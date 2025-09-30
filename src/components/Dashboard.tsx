import { AlertTriangle, Plus, Users, Clock, CheckCircle, Circle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import type { Ticket, User, Screen } from '../App';

interface DashboardProps {
  tickets: Ticket[];
  users: User[];
  onNavigate: (screen: Screen, ticketId?: string) => void;
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
}

export function Dashboard({ tickets, users, onNavigate, onUpdateTicket }: DashboardProps) {
  const urgentTickets = tickets.filter(t => t.status === 'urgent');
  const otherTickets = tickets.filter(t => t.status !== 'urgent');
  
  const ticketsByStatus = {
    en_cours: otherTickets.filter(t => t.status === 'en_cours'),
    assigne: otherTickets.filter(t => t.status === 'assigne'),
    resolu: otherTickets.filter(t => t.status === 'resolu')
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critique': return 'bg-red-100 text-red-800 border-red-200';
      case 'haute': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normale': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'basse': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'en_cours': return <Clock className="w-4 h-4" />;
      case 'assigne': return <Circle className="w-4 h-4" />;
      case 'resolu': return <CheckCircle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'en_cours': return 'text-blue-600 bg-blue-50';
      case 'assigne': return 'text-yellow-600 bg-yellow-50';
      case 'resolu': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return `Il y a ${Math.floor(diffInHours / 24)}j`;
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-blue-900 mb-2">Tableau de bord TechSolutions</h1>
          <p className="text-gray-600">Gestion des tickets de support technique</p>
        </div>
        <Button 
          onClick={() => onNavigate('create-ticket')}
          className="bg-blue-600 hover:bg-blue-700 min-h-[44px] md:min-h-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau ticket
        </Button>
      </div>

      {/* Tickets urgents */}
      {urgentTickets.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-red-800">Tickets urgents ({urgentTickets.length})</h2>
          </div>
          <div className="grid gap-4">
            {urgentTickets.map(ticket => (
              <Card 
                key={ticket.id}
                className="p-4 border-l-4 border-l-red-500 bg-red-50/50 cursor-pointer hover:bg-red-50 transition-colors"
                onClick={() => onNavigate('ticket-detail', ticket.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        {ticket.id}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <h3 className="mb-1">{ticket.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{ticket.clientName}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{ticket.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Assigné à</p>
                    <p className="font-medium">{ticket.assignedTech}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(ticket.updatedAt)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonnes de tickets par statut */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(ticketsByStatus).map(([status, statusTickets]) => (
            <div key={status}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </div>
                <h3>
                  {status === 'en_cours' ? 'En cours' : 
                   status === 'assigne' ? 'Assignés' : 'Résolus'} 
                  ({statusTickets.length})
                </h3>
              </div>
              
              <div className="grid gap-3">
                {statusTickets.length === 0 ? (
                  <Card className="p-6 text-center text-gray-500">
                    Aucun ticket {status === 'en_cours' ? 'en cours' : 
                                  status === 'assigne' ? 'assigné' : 'résolu'}
                  </Card>
                ) : (
                  statusTickets.map(ticket => (
                    <Card 
                      key={ticket.id}
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onNavigate('ticket-detail', ticket.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{ticket.id}</Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <h4 className="mb-1">{ticket.title}</h4>
                          <p className="text-gray-600 text-sm mb-1">{ticket.clientName}</p>
                          <p className="text-gray-600 text-sm">{ticket.category}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-gray-600">{ticket.assignedTech}</p>
                          <p className="text-gray-500">{formatTimeAgo(ticket.updatedAt)}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vue charge équipe */}
        <div>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h3>Charge de l'équipe</h3>
            </div>
            
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {user.role.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          user.available ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="text-sm text-gray-600">
                        {user.workload}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        user.workload >= 80 
                          ? 'bg-red-500' 
                          : user.workload >= 60 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${user.workload}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      {tickets.filter(t => t.assignedTo === user.id && t.status !== 'resolu').length} tickets actifs
                    </span>
                    <span>
                      {user.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-sm text-gray-600">
              <p className="mb-1">
                <span className="font-medium">{tickets.filter(t => t.status === 'urgent').length}</span> tickets urgents
              </p>
              <p className="mb-1">
                <span className="font-medium">{tickets.filter(t => t.status === 'en_cours').length}</span> tickets en cours
              </p>
              <p>
                <span className="font-medium">{tickets.filter(t => t.status === 'assigne').length}</span> tickets assignés
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}