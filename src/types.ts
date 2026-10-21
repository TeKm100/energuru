export type PublicPage = 
  | 'home' 
  | 'about' 
  | 'how-it-works' 
  | 'contact' 
  | 'signin' 
  | 'create-account'
  | 'forgot-password'
  | 'reset-password'
  | 'plans'
  | 'connector'
  | 'get-quote';

export type AuthPage = 
  | 'dashboard' 
  | 'equipment'
  | 'energy-costs'
  | 'outage-prep'
  | 'community-funding'
  | 'connector'
  | 'connect-device'
  | 'buy-connector'
  | 'get-quote'
  | 'plans'
  | 'profile' 
  | 'settings';

export type Page = PublicPage | AuthPage;

export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  nickname?: string;
  created_at?: string;
  updated_at?: string;
}

export type QuoteStatus = 
  | 'Submitted' 
  | 'Under Review' 
  | 'More Information Needed' 
  | 'Quote Prepared' 
  | 'Quote Sent' 
  | 'Accepted' 
  | 'Closed';

export interface QuoteEnquiry {
  id: string;
  reference: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  contact_channel: 'whatsapp' | 'telegram' | 'email' | 'callback';
  contact_detail: string;
  state_location: string;
  customer_type: 'household' | 'small-business' | 'hotel' | 'institution' | 'other';
  energy_problem: string;
  equipment_count: string;
  installation_needed: 'yes' | 'no' | 'unsure';
  additional_details?: string;
  consent: boolean;
  status: QuoteStatus;
  created_at: string;
}

export type InfoModalType = 
  | 'search'
  | 'feedback'
  | 'legal'
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'affiliate'
  | 'forgot-password'
  | null;
