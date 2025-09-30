import { useState } from 'react';
import { ArrowLeft, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, Camera, Paperclip } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import type { User, Screen, TicketPriority } from '../App';

interface CreateTicketProps {
  users: User[];
  onNavigate: (screen: Screen) => void;
  onCreateTicket: (ticketData: any) => void;
}

export function CreateTicket({ users, onNavigate, onCreateTicket }: CreateTicketProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    priority: 'normale' as TicketPriority,
    category: '',
    subcategory: '',
    title: '',
    description: '',
    assignedTo: '',
    estimatedTime: '',
    location: '',
    equipment: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = {
    'Infrastructure': ['Serveurs', 'Réseau', 'Stockage', 'Sécurité'],
    'Logiciels': ['Applications métier', 'Mise à jour', 'Installation', 'Configuration'],
    'Matériel': ['Ordinateurs', 'Imprimantes', 'Téléphones', 'Périphériques'],
    'Support utilisateur': ['Formation', 'Dépannage', 'Aide technique', 'Compte utilisateur']
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur si elle existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId.trim()) {
      newErrors.clientId = 'ID client requis';
    }
    if (!formData.priority) {
      newErrors.priority = 'Urgence requise';
    }
    if (!formData.category) {
      newErrors.category = 'Catégorie requise';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Titre requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const ticketData = {
      ...formData,
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
    };

    onCreateTicket(ticketData);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critique': return 'text-red-600';
      case 'haute': return 'text-orange-600';
      case 'normale': return 'text-blue-600';
      case 'basse': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryHelp = (category: string) => {
    const descriptions = {
      'Infrastructure': 'Problèmes liés aux serveurs, réseau, stockage et sécurité informatique',
      'Logiciels': 'Applications métier, installations, mises à jour et configurations logicielles',
      'Matériel': 'Problèmes hardware : ordinateurs, imprimantes, téléphones et périphériques',
      'Support utilisateur': 'Aide technique, formation, dépannage et gestion des comptes utilisateur'
    };
    return descriptions[category as keyof typeof descriptions] || '';
  };

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
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
          <div>
            <h1 className="text-blue-900">Créer un nouveau ticket</h1>
            <p className="text-gray-600">Remplissez les informations essentielles pour créer le ticket</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champs obligatoires */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <h2>Informations essentielles</h2>
              <span className="text-sm text-gray-500">*Champs obligatoires</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Client */}
              <div>
                <Label htmlFor="clientId" className="flex items-center gap-1">
                  ID Client *
                </Label>
                <Input
                  id="clientId"
                  placeholder="ex: CLI-123"
                  value={formData.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  className={`min-h-[44px] md:min-h-auto ${errors.clientId ? 'border-red-500' : ''}`}
                />
                {errors.clientId && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientId}</p>
                )}
              </div>

              {/* Nom Client */}
              <div>
                <Label htmlFor="clientName">Nom du client</Label>
                <Input
                  id="clientName"
                  placeholder="ex: Entreprise ABC"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="min-h-[44px] md:min-h-auto"
                />
              </div>

              {/* Urgence */}
              <div>
                <Label className="flex items-center gap-1">
                  Urgence *
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 text-sm">
                        <p><strong>Critique:</strong> Production arrêtée</p>
                        <p><strong>Haute:</strong> Impact métier important</p>
                        <p><strong>Normale:</strong> Fonctionnalité dégradée</p>
                        <p><strong>Basse:</strong> Amélioration ou demande</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className={`min-h-[44px] md:min-h-auto ${errors.priority ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Sélectionner l'urgence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critique">
                      <span className="flex items-center gap-2">
                        🔴 <span className="text-red-600">Critique</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="haute">
                      <span className="flex items-center gap-2">
                        🟠 <span className="text-orange-600">Haute</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="normale">
                      <span className="flex items-center gap-2">
                        🔵 <span className="text-blue-600">Normale</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="basse">
                      <span className="flex items-center gap-2">
                        ⚪ <span className="text-gray-600">Basse</span>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-red-600 text-sm mt-1">{errors.priority}</p>
                )}
              </div>

              {/* Catégorie */}
              <div>
                <Label className="flex items-center gap-1">
                  Catégorie *
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm max-w-xs">
                        {formData.category ? getCategoryHelp(formData.category) : 'Sélectionnez une catégorie pour voir sa description'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select value={formData.category} onValueChange={(value) => {
                  handleInputChange('category', value);
                  setFormData(prev => ({ ...prev, subcategory: '' })); // Reset subcategory
                }}>
                  <SelectTrigger className={`min-h-[44px] md:min-h-auto ${errors.category ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Sous-catégorie */}
              {formData.category && (
                <div className="md:col-span-2">
                  <Label>Sous-catégorie</Label>
                  <Select value={formData.subcategory} onValueChange={(value) => handleInputChange('subcategory', value)}>
                    <SelectTrigger className="min-h-[44px] md:min-h-auto">
                      <SelectValue placeholder="Sélectionner une sous-catégorie (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[formData.category as keyof typeof categories]?.map(subcategory => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Titre et Description */}
            <div className="space-y-4 mt-6">
              <div>
                <Label htmlFor="title">Titre du problème *</Label>
                <Input
                  id="title"
                  placeholder="ex: Serveur principal inaccessible"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`min-h-[44px] md:min-h-auto ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description détaillée *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le problème en détail, les symptômes observés, et les actions déjà tentées..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Détails supplémentaires (repliable) */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <Card className="p-6">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto justify-start">
                  <div className="flex items-center gap-2">
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <h3>Plus de détails</h3>
                    <span className="text-sm text-gray-500">(optionnel)</span>
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assignation */}
                  <div>
                    <Label>Technicien assigné</Label>
                    <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                      <SelectTrigger className="min-h-[44px] md:min-h-auto">
                        <SelectValue placeholder="Assigner automatiquement" />
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

                  {/* Estimation temps */}
                  <div>
                    <Label htmlFor="estimatedTime">Temps estimé (heures)</Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      min="0.5"
                      step="0.5"
                      placeholder="ex: 2"
                      value={formData.estimatedTime}
                      onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                      className="min-h-[44px] md:min-h-auto"
                    />
                  </div>

                  {/* Localisation */}
                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      placeholder="ex: Bureau étage 2, Salle serveur A"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="min-h-[44px] md:min-h-auto"
                    />
                  </div>

                  {/* Équipement */}
                  <div>
                    <Label htmlFor="equipment">Équipement concerné</Label>
                    <Input
                      id="equipment"
                      placeholder="ex: Dell PowerEdge R740, HP LaserJet Pro"
                      value={formData.equipment}
                      onChange={(e) => handleInputChange('equipment', e.target.value)}
                      className="min-h-[44px] md:min-h-auto"
                    />
                  </div>

                  {/* Contact */}
                  <div>
                    <Label htmlFor="contactPerson">Personne de contact</Label>
                    <Input
                      id="contactPerson"
                      placeholder="ex: Jean Dupont"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      className="min-h-[44px] md:min-h-auto"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Téléphone de contact</Label>
                    <Input
                      id="contactPhone"
                      placeholder="ex: 01 23 45 67 89"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      className="min-h-[44px] md:min-h-auto"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="contactEmail">Email de contact</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="ex: contact@entreprise.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="min-h-[44px] md:min-h-auto"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Fichiers joints */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Fichiers joints</h3>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,application/pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="min-h-[44px] md:min-h-auto"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Ajouter fichier
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.capture = 'environment';
                    input.onchange = (e) => {
                      const files = Array.from((e.target as HTMLInputElement).files || []);
                      setAttachments(prev => [...prev, ...files]);
                    };
                    input.click();
                  }}
                  className="min-h-[44px] md:min-h-auto"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Prendre photo
                </Button>
              </div>
            </div>

            {attachments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun fichier sélectionné. Ajoutez des photos ou documents pour documenter le problème.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Paperclip className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 flex-1 min-h-[44px] md:min-h-auto"
            >
              Créer le ticket
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              className="md:w-auto min-h-[44px] md:min-h-auto"
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}