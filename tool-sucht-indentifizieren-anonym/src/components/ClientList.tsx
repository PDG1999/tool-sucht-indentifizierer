import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, BarChart3, Calendar, Phone, Mail, Users } from 'lucide-react';
import { Client, TestResult } from '../types/dashboard';
import { mockClients, mockTestResults } from '../data/mockData';

interface ClientListProps {
  onClientSelect: (clientId: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ onClientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [clients] = useState<Client[]>(mockClients);
  const [testResults] = useState<TestResult[]>(mockTestResults);

  const getRiskLevel = (clientId: string) => {
    const latestTest = testResults
      .filter(test => test.clientId === clientId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
    
    if (!latestTest) return { level: 'Unbekannt', color: 'gray' };
    
    const riskMap = {
      'low': { level: 'Niedrig', color: 'green' },
      'moderate': { level: 'Mittel', color: 'yellow' },
      'high': { level: 'Hoch', color: 'orange' },
      'critical': { level: 'Kritisch', color: 'red' }
    };
    
    return riskMap[latestTest.riskLevel] || { level: 'Unbekannt', color: 'gray' };
  };

  const getLastTestDate = (clientId: string) => {
    const latestTest = testResults
      .filter(test => test.clientId === clientId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
    
    return latestTest ? new Date(latestTest.completedAt).toLocaleDateString('de-DE') : 'Nie';
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterRisk === 'all') return matchesSearch;
    
    const risk = getRiskLevel(client.id);
    return matchesSearch && risk.level.toLowerCase().includes(filterRisk.toLowerCase());
  });

  const getRiskColorClasses = (color: string) => {
    const colorMap = {
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      orange: 'text-orange-600 bg-orange-100',
      red: 'text-red-600 bg-red-100',
      gray: 'text-gray-600 bg-gray-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klienten-Management</h1>
          <p className="text-gray-600">Verwalten Sie Ihre Klienten und deren Test-Ergebnisse</p>
        </div>
        <button className="bg-samebi-600 text-white px-4 py-2 rounded-lg hover:bg-samebi-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Neuer Klient
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Klienten suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent"
              title="Risikostufe filtern"
            >
              <option value="all">Alle Risikostufen</option>
              <option value="niedrig">Niedrig</option>
              <option value="mittel">Mittel</option>
              <option value="hoch">Hoch</option>
              <option value="kritisch">Kritisch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Klient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Letzter Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risiko
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => {
                const risk = getRiskLevel(client.id);
                const lastTest = getLastTestDate(client.id);
                
                return (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">ID: {client.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {client.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-2" />
                            {client.email}
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-2" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                        {lastTest}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColorClasses(risk.color)}`}>
                        {risk.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active' 
                          ? 'text-green-600 bg-green-100' 
                          : client.status === 'inactive'
                          ? 'text-yellow-600 bg-yellow-100'
                          : 'text-gray-600 bg-gray-100'
                      }`}>
                        {client.status === 'active' ? 'Aktiv' : 
                         client.status === 'inactive' ? 'Inaktiv' : 'Archiviert'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onClientSelect(client.id)}
                          className="text-samebi-600 hover:text-samebi-900 p-1"
                          title="Details anzeigen"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1" title="Bearbeiten">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1" title="Analytics">
                          <BarChart3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Klienten gefunden</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Versuchen Sie einen anderen Suchbegriff.' : 'Fügen Sie Ihren ersten Klienten hinzu.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientList;
