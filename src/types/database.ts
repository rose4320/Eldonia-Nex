export type ArtworkMediaType = "image" | "video" | "audio" | "document";

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  locale: string;
  is_creator: boolean;
  created_at: string;
  updated_at: string;
};

export type Artwork = {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  media_type: ArtworkMediaType;
  media_url: string;
  thumbnail_url: string | null;
  category: string;
  tags: string[];
  is_public: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type ArtworkWithCreator = Artwork & {
  profiles: Pick<Profile, "display_name" | "username" | "avatar_url"> | null;
};

export type ShopProductType = "physical" | "digital";

export type ShopProduct = {
  id: string;
  seller_id: string | null;
  title: string;
  description: string | null;
  category: string;
  product_type: ShopProductType;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  gallery_urls: string[];
  rating: number;
  review_count: number;
  stock_quantity: number | null;
  is_nexus_prime: boolean;
  is_nexus_choice: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type ShopProductWithSeller = ShopProduct & {
  profiles: Pick<Profile, "display_name" | "username"> | null;
};

export type EventFormat = "online" | "offline" | "hybrid";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export type NexusEvent = {
  id: string;
  organizer_id: string | null;
  title: string;
  description: string | null;
  category: string;
  format: EventFormat;
  status: EventStatus;
  starts_at: string;
  ends_at: string | null;
  venue_name: string | null;
  venue_address: string | null;
  online_url: string | null;
  cover_image_url: string | null;
  ticket_price: number;
  compare_price: number | null;
  capacity: number | null;
  tickets_sold: number;
  is_featured: boolean;
  is_nexus_verified: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type NexusEventWithOrganizer = NexusEvent & {
  profiles: Pick<Profile, "display_name" | "username"> | null;
};

export type CommunityBoard = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type CommunityThread = {
  id: string;
  board_id: string;
  author_id: string | null;
  title: string;
  body: string;
  locale: string;
  reply_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type CommunityThreadWithAuthor = CommunityThread & {
  profiles: Pick<Profile, "display_name" | "username"> | null;
  community_boards: Pick<CommunityBoard, "slug" | "name"> | null;
};

export type CommunityReply = {
  id: string;
  thread_id: string;
  author_id: string | null;
  body: string;
  locale: string;
  created_at: string;
};

export type CommunityReplyWithAuthor = CommunityReply & {
  profiles: Pick<Profile, "display_name" | "username"> | null;
};

export type JobType = "freelance" | "full_time" | "part_time" | "collab";
export type JobStatus = "open" | "closed" | "filled";
export type PortfolioVisibility = "public" | "employers_only" | "private";

export type Portfolio = {
  id: string;
  user_id: string;
  headline: string | null;
  summary: string | null;
  skills: string[];
  exp_points: number;
  level: number;
  title_badge: string | null;
  visibility: PortfolioVisibility;
  attach_on_apply: boolean;
  created_at: string;
  updated_at: string;
};

export type JobListing = {
  id: string;
  poster_id: string | null;
  title: string;
  description: string;
  job_type: JobType;
  location: string | null;
  budget_min: number | null;
  budget_max: number | null;
  skills_required: string[];
  status: JobStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type JobListingWithPoster = JobListing & {
  profiles: Pick<Profile, "display_name" | "username"> | null;
};

export type JobApplication = {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_message: string | null;
  portfolio_snapshot: unknown;
  status: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  status: string;
  total_amount: number;
  currency: string;
  items: unknown;
  created_at: string;
  updated_at: string;
};

export type SupportTicketCategory =
  | "account"
  | "billing"
  | "gallery"
  | "shop"
  | "events"
  | "community"
  | "works"
  | "technical"
  | "other";

export type SupportTicketPriority = "low" | "normal" | "high" | "urgent";

export type SupportTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_user"
  | "resolved"
  | "closed";

export type SupportFaqArticle = {
  id: string;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SupportTicket = {
  id: string;
  ticket_number: string;
  user_id: string | null;
  contact_name: string;
  contact_email: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  subject: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export type SupportTicketMessage = {
  id: string;
  ticket_id: string;
  author_user_id: string | null;
  author_name: string;
  is_staff: boolean;
  body: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          locale?: string;
          is_creator?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          locale?: string;
          is_creator?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      artworks: {
        Row: Artwork;
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          media_type?: ArtworkMediaType;
          media_url: string;
          thumbnail_url?: string | null;
          category?: string;
          tags?: string[];
          is_public?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          media_type?: ArtworkMediaType;
          media_url?: string;
          thumbnail_url?: string | null;
          category?: string;
          tags?: string[];
          is_public?: boolean;
          view_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      shop_products: {
        Row: ShopProduct;
        Insert: {
          id?: string;
          seller_id?: string | null;
          title: string;
          description?: string | null;
          category?: string;
          product_type?: ShopProductType;
          price: number;
          compare_at_price?: number | null;
          image_url?: string | null;
          gallery_urls?: string[];
          rating?: number;
          review_count?: number;
          stock_quantity?: number | null;
          is_nexus_prime?: boolean;
          is_nexus_choice?: boolean;
          is_bestseller?: boolean;
          is_active?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          category?: string;
          product_type?: ShopProductType;
          price?: number;
          compare_at_price?: number | null;
          image_url?: string | null;
          gallery_urls?: string[];
          rating?: number;
          review_count?: number;
          stock_quantity?: number | null;
          is_nexus_prime?: boolean;
          is_nexus_choice?: boolean;
          is_bestseller?: boolean;
          is_active?: boolean;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: NexusEvent;
        Insert: {
          id?: string;
          organizer_id?: string | null;
          title: string;
          description?: string | null;
          category?: string;
          format?: EventFormat;
          status?: EventStatus;
          starts_at: string;
          ends_at?: string | null;
          venue_name?: string | null;
          venue_address?: string | null;
          online_url?: string | null;
          cover_image_url?: string | null;
          ticket_price?: number;
          compare_price?: number | null;
          capacity?: number | null;
          tickets_sold?: number;
          is_featured?: boolean;
          is_nexus_verified?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          category?: string;
          format?: EventFormat;
          status?: EventStatus;
          starts_at?: string;
          ends_at?: string | null;
          venue_name?: string | null;
          venue_address?: string | null;
          online_url?: string | null;
          cover_image_url?: string | null;
          ticket_price?: number;
          compare_price?: number | null;
          capacity?: number | null;
          tickets_sold?: number;
          is_featured?: boolean;
          is_nexus_verified?: boolean;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      community_boards: {
        Row: CommunityBoard;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      community_threads: {
        Row: CommunityThread;
        Insert: {
          id?: string;
          board_id: string;
          author_id?: string | null;
          title: string;
          body: string;
          locale?: string;
          reply_count?: number;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          body?: string;
          reply_count?: number;
          is_pinned?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      community_replies: {
        Row: CommunityReply;
        Insert: {
          id?: string;
          thread_id: string;
          author_id?: string | null;
          body: string;
          locale?: string;
          created_at?: string;
        };
        Update: { body?: string };
        Relationships: [];
      };
      portfolios: {
        Row: Portfolio;
        Insert: {
          id?: string;
          user_id: string;
          headline?: string | null;
          summary?: string | null;
          skills?: string[];
          exp_points?: number;
          level?: number;
          title_badge?: string | null;
          visibility?: PortfolioVisibility;
          attach_on_apply?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          headline?: string | null;
          summary?: string | null;
          skills?: string[];
          exp_points?: number;
          level?: number;
          title_badge?: string | null;
          visibility?: PortfolioVisibility;
          attach_on_apply?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      job_listings: {
        Row: JobListing;
        Insert: {
          id?: string;
          poster_id?: string | null;
          title: string;
          description: string;
          job_type?: JobType;
          location?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          skills_required?: string[];
          status?: JobStatus;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          job_type?: JobType;
          location?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          skills_required?: string[];
          status?: JobStatus;
          is_featured?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      job_applications: {
        Row: {
          id: string;
          job_id: string;
          applicant_id: string;
          cover_message: string | null;
          portfolio_snapshot: unknown;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          applicant_id: string;
          cover_message?: string | null;
          portfolio_snapshot?: unknown;
          status?: string;
          created_at?: string;
        };
        Update: { status?: string; cover_message?: string | null };
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: {
          id?: string;
          user_id?: string | null;
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          status?: string;
          total_amount?: number;
          currency?: string;
          items?: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          status?: string;
          total_amount?: number;
          items?: unknown;
          updated_at?: string;
        };
        Relationships: [];
      };
      support_faq_articles: {
        Row: SupportFaqArticle;
        Insert: {
          id?: string;
          category: string;
          question: string;
          answer: string;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          question?: string;
          answer?: string;
          sort_order?: number;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      support_tickets: {
        Row: SupportTicket;
        Insert: {
          id?: string;
          ticket_number?: string;
          user_id?: string | null;
          contact_name: string;
          contact_email: string;
          category?: SupportTicketCategory;
          priority?: SupportTicketPriority;
          status?: SupportTicketStatus;
          subject: string;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          contact_name?: string;
          contact_email?: string;
          category?: SupportTicketCategory;
          priority?: SupportTicketPriority;
          status?: SupportTicketStatus;
          subject?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Relationships: [];
      };
      support_ticket_messages: {
        Row: SupportTicketMessage;
        Insert: {
          id?: string;
          ticket_id: string;
          author_user_id?: string | null;
          author_name: string;
          is_staff?: boolean;
          body: string;
          created_at?: string;
        };
        Update: {
          body?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      artwork_media_type: ArtworkMediaType;
      shop_product_type: ShopProductType;
      event_format: EventFormat;
      event_status: EventStatus;
      job_type: JobType;
      job_status: JobStatus;
      portfolio_visibility: PortfolioVisibility;
      support_ticket_category: SupportTicketCategory;
      support_ticket_priority: SupportTicketPriority;
      support_ticket_status: SupportTicketStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
