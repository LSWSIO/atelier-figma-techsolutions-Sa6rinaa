import { useState } from 'react';
import { ArrowLeft, AlertTriangle, User, Clock, MapPin, Wrench, Camera, Paperclip, Send, MoreHorizontal } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import type { Ticket, User, Screen, TicketStatus, TicketPriority } from '../App';

interface TicketDetailProps {
  ticket: Ticket;
  users: User[];
  onNavigate: (screen: Screen) => void;
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  onAddComment: (ticketId: string, content: string) => void;
  onAddAttachment: (ticketId: string, file: File) => void;
}

export function TicketDetail({ 
  ticket, 
  users, 
  onNavigate, 
  onUpdateTicket, 
  onAddComment, 
  onAddAttachment 
}: TicketDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critique': return 'bg-red-100 text-red-800 border-red-200';
      case 'haute': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normale': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'basse': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(ticket.id, newComment.trim());
      setNewComment('');
      setIsAddingComment(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAddAttachment(ticket.id, file);
    }
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    onUpdateTicket(ticket.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: TicketPriority) => {
    onUpdateTicket(ticket.id, { priority: newPriority });
  };

  const handleAssignmentChange = (newAssignedTo: string) => {
    const user = users.find(u => u.id === newAssignedTo);
    onUpdateTicket(ticket.id, { 
      assignedTo: newAssignedTo,
      assignedTech: user?.name 
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onNavigate('dashboard')}
          className="min-h-[44px] md:min-h-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="text-base px-3 py-1">
              {ticket.id}
            </Badge>
            {ticket.status === 'urgent' && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">URGENT</span>
              </div>
            )}
          </div>
          <h1 className="text-blue-900">{ticket.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations essentielles */}
          <Card className={`p-6 ${ticket.status === 'urgent' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
            <h3 className="mb-4">Informations essentielles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Client</label>
                  <p className="font-medium">{ticket.clientName}</p>
                  <p className="text-sm text-gray-600">{ticket.clientId}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Catégorie</label>
                  <p className="font-medium">{ticket.category}</p>
                  {ticket.subcategory && (
                    <p className="text-sm text-gray-600">{ticket.subcategory}</p>
                  )}
                </div>
                
                {ticket.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{ticket.location}</span>
                  </div>
                )}
                
                {ticket.equipment && (
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-gray-500" />
                    <span>{ticket.equipment}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Urgence</label>
                  <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="min-h-[44px] md:min-h-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critique">🔴 Critique</SelectItem>
                      <SelectItem value="haute">🟠 Haute</SelectItem>
                      <SelectItem value="normale">🔵 Normale</SelectItem>
                      <SelectItem value="basse">⚪ Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Statut</label>
                  <Select value={ticket.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="min-h-[44px] md:min-h-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">🚨 Urgent</SelectItem>
                      <SelectItem value="en_cours">⏳ En cours</SelectItem>
                      <SelectItem value="assigne">📋 Assigné</SelectItem>
                      <SelectItem value="resolu">✅ Résolu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Technicien assigné</label>
                  <Select value={ticket.assignedTo || ''} onValueChange={handleAssignmentChange}>
                    <SelectTrigger className="min-h-[44px] md:min-h-auto">
                      <SelectValue placeholder="Sélectionner un technicien" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${user.available ? 'bg-green-500' : 'bg-red-500'}`} />
                            {user.name} ({user.role.replace('_', ' ')})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {ticket.estimatedTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Estimation : {ticket.estimatedTime}h</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h3 className="mb-3">Description du problème</h3>
            <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
          </Card>

          {/* Fichiers joints */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Fichiers joints ({ticket.attachments.length})</h3>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf,.doc,.docx"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="min-h-[44px] md:min-h-auto"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Ajouter fichier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Simuler la prise de photo sur mobile/tablette
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.capture = 'environment';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) onAddAttachment(ticket.id, file);
                    };
                    input.click();
                  }}
                  className="min-h-[44px] md:min-h-auto"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Ajouter photo
                </Button>
              </div>
            </div>
            
            {ticket.attachments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun fichier joint</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ticket.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {attachment.type === 'image' ? (
                        <img 
                          src={attachment.url} 
                          alt={attachment.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Paperclip className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{attachment.name}</p>
                      <p className="text-sm text-gray-600">{attachment.uploadedBy}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(attachment.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Historique et métadonnées */}
        <div className="space-y-6">
          {/* Métadonnées */}
          <Card className="p-6">
            <h3 className="mb-4">Informations</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Créé le :</span>
                <p className="font-medium">{formatDateTime(ticket.createdAt)}</p>
              </div>
              <div>
                <span className="text-gray-600">Dernière mise à jour :</span>
                <p className="font-medium">{formatDateTime(ticket.updatedAt)}</p>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(ticket.status)}`}>
                {ticket.status === 'urgent' ? 'Urgent' :
                 ticket.status === 'en_cours' ? 'En cours' :
                 ticket.status === 'assigne' ? 'Assigné' : 'Résolu'}
              </div>
            </div>
          </Card>

          {/* Historique des échanges */}
          <Card className="p-6">
            <h3 className="mb-4">Historique des échanges</h3>
            
            <div className="space-y-4 mb-4">
              {ticket.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucun commentaire</p>
              ) : (
                ticket.comments.map(comment => (
                  <div key={comment.id} className="border-l-2 border-blue-200 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
            
            {/* Ajouter un commentaire */}
            {isAddingComment ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="min-h-[44px] md:min-h-auto"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingComment(false);
                      setNewComment('');
                    }}
                    className="min-h-[44px] md:min-h-auto"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingComment(true)}
                className="w-full min-h-[44px] md:min-h-auto"
              >
                Ajouter un commentaire
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}