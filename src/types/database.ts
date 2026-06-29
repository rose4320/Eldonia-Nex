export type ArtworkMediaType = "image" | "video" | "audio" | "document";

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  locale: string;
  is_creator: boolean;
  is_ops_admin?: boolean;
  subscription_plan: "free" | "standard" | "pro";
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  user_id: string;
  legal_name: string | null;
  country: string;
  address_line1: string | null;
  address_line2: string | null;
  phone: string | null;
  bank_name: string | null;
  bank_branch: string | null;
  bank_account_type: string | null;
  bank_account_number: string | null;
  bank_account_holder: string | null;
  notify_fan: boolean;
  notify_like: boolean;
  notify_comment: boolean;
  notify_collab: boolean;
  notify_lab: boolean;
  notify_order: boolean;
  notify_support: boolean;
  notify_announcement: boolean;
  created_at: string;
  updated_at: string;
};

export type UserNotification = {
  id: string;
  user_id: string;
  kind:
    | "notification"
    | "announcement"
    | "collab_request"
    | "collab_accepted"
    | "collab_declined"
    | "fan_registered"
    | "artwork_liked"
    | "artwork_commented"
    | "lab_post"
    | "order_paid"
    | "support_reply";
  title: string;
  body: string | null;
  href: string | null;
  collab_request_id: string | null;
  is_read: boolean;
  created_at: string;
};

export type UserPlanChange = {
  id: string;
  user_id: string;
  from_plan: "free" | "standard" | "pro";
  to_plan: "free" | "standard" | "pro";
  payment_status: "not_required" | "pending" | "completed" | "failed";
  stripe_session_id: string | null;
  changed_via: "signup" | "settings" | "admin" | "stripe_webhook";
  created_at: string;
};

export type UserOnboarding = {
  user_id: string;
  selected_plan: "free" | "standard" | "pro";
  payment_status: "not_required" | "pending" | "completed" | "failed";
  stripe_session_id: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserConsent = {
  id: string;
  user_id: string;
  consent_type: string;
  document_title: string;
  document_version: string;
  agreed_at: string;
  created_at: string;
};

export type UserReferralCode = {
  user_id: string;
  referral_code: string;
  referral_url: string;
  status: "active" | "disabled";
  created_at: string;
  updated_at: string;
};

export type CollabLab = {
  id: string;
  artwork_id: string;
  collab_request_id: string;
  title: string;
  created_at: string;
};

export type CollabLabMember = {
  lab_id: string;
  user_id: string;
  role: "owner" | "collaborator";
  joined_at: string;
};

export type CollabLabPost = {
  id: string;
  lab_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

export type CollabLabPostWithAuthor = CollabLabPost & {
  profiles: Pick<Profile, "display_name" | "username" | "avatar_url"> | null;
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

export type ArtworkComment = {
  id: string;
  artwork_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type ArtworkCommentWithAuthor = ArtworkComment & {
  profiles: Pick<Profile, "display_name" | "username" | "avatar_url"> | null;
};

export type CreatorFan = {
  fan_id: string;
  creator_id: string;
  created_at: string;
};

export type CollabRequestStatus = "pending" | "accepted" | "declined" | "cancelled";

export type CollabRequest = {
  id: string;
  artwork_id: string;
  requester_id: string;
  creator_id: string;
  message: string | null;
  status: CollabRequestStatus;
  created_at: string;
  updated_at: string;
};

export type PendingCollabRequest = {
  id: string;
  message: string | null;
  created_at: string;
  requester: {
    display_name: string | null;
    username: string | null;
  };
};

export type ArtworkEngagementState = {
  fanCount: number;
  isFan: boolean;
  collabRequest: Pick<CollabRequest, "id" | "status" | "message"> | null;
  likeCount: number;
  isLiked: boolean;
  /** この作品に紐づく Lab に参加している（または作者で Lab あり） */
  labAvailable: boolean;
  /** 作品作者向け: 未処理のコラボ申請 */
  pendingCollabRequests: PendingCollabRequest[];
};

export type ArtworkLike = {
  artwork_id: string;
  user_id: string;
  created_at: string;
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

export type QuestKind = "daily" | "brand" | "community";
export type QuestStatus = "draft" | "open" | "closed";

export type Quest = {
  id: string;
  title: string;
  description: string;
  kind: QuestKind;
  status: QuestStatus;
  exp_reward: number;
  prize_summary: string | null;
  submission_hint: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_featured: boolean;
  published_by: string | null;
  created_at: string;
  updated_at: string;
};

export type QuestParticipationStatus = "joined" | "submitted" | "completed" | "winner";

export type QuestParticipation = {
  id: string;
  quest_id: string;
  user_id: string;
  status: QuestParticipationStatus;
  submission_url: string | null;
  submission_note: string | null;
  exp_awarded: number;
  portfolio_entry: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type QuestParticipationWithQuest = QuestParticipation & {
  quests: Quest | null;
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
          is_ops_admin?: boolean;
          subscription_plan?: "free" | "standard" | "pro";
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
          is_ops_admin?: boolean;
          subscription_plan?: "free" | "standard" | "pro";
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
      artwork_comments: {
        Row: ArtworkComment;
        Insert: {
          id?: string;
          artwork_id: string;
          author_id: string;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      creator_fans: {
        Row: CreatorFan;
        Insert: {
          fan_id: string;
          creator_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      collab_requests: {
        Row: CollabRequest;
        Insert: {
          id?: string;
          artwork_id: string;
          requester_id: string;
          creator_id: string;
          message?: string | null;
          status?: CollabRequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          message?: string | null;
          status?: CollabRequestStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      artwork_likes: {
        Row: ArtworkLike;
        Insert: {
          artwork_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
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
      quests: {
        Row: Quest;
        Insert: {
          id?: string;
          title: string;
          description: string;
          kind?: QuestKind;
          status?: QuestStatus;
          exp_reward?: number;
          prize_summary?: string | null;
          submission_hint?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          is_featured?: boolean;
          published_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          kind?: QuestKind;
          status?: QuestStatus;
          exp_reward?: number;
          prize_summary?: string | null;
          submission_hint?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          is_featured?: boolean;
          published_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      quest_participations: {
        Row: QuestParticipation;
        Insert: {
          id?: string;
          quest_id: string;
          user_id: string;
          status?: QuestParticipationStatus;
          submission_url?: string | null;
          submission_note?: string | null;
          exp_awarded?: number;
          portfolio_entry?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: QuestParticipationStatus;
          submission_url?: string | null;
          submission_note?: string | null;
          exp_awarded?: number;
          portfolio_entry?: Record<string, unknown>;
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
      user_settings: {
        Row: UserSettings;
        Insert: {
          user_id: string;
          legal_name?: string | null;
          country?: string;
          address_line1?: string | null;
          address_line2?: string | null;
          phone?: string | null;
          bank_name?: string | null;
          bank_branch?: string | null;
          bank_account_type?: string | null;
          bank_account_number?: string | null;
          bank_account_holder?: string | null;
          notify_fan?: boolean;
          notify_like?: boolean;
          notify_comment?: boolean;
          notify_collab?: boolean;
          notify_lab?: boolean;
          notify_order?: boolean;
          notify_support?: boolean;
          notify_announcement?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          legal_name?: string | null;
          country?: string;
          address_line1?: string | null;
          address_line2?: string | null;
          phone?: string | null;
          bank_name?: string | null;
          bank_branch?: string | null;
          bank_account_type?: string | null;
          bank_account_number?: string | null;
          bank_account_holder?: string | null;
          notify_fan?: boolean;
          notify_like?: boolean;
          notify_comment?: boolean;
          notify_collab?: boolean;
          notify_lab?: boolean;
          notify_order?: boolean;
          notify_support?: boolean;
          notify_announcement?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_onboarding: {
        Row: UserOnboarding;
        Insert: {
          user_id: string;
          selected_plan?: "free" | "standard" | "pro";
          payment_status?: "not_required" | "pending" | "completed" | "failed";
          stripe_session_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          selected_plan?: "free" | "standard" | "pro";
          payment_status?: "not_required" | "pending" | "completed" | "failed";
          stripe_session_id?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_plan_changes: {
        Row: UserPlanChange;
        Insert: {
          id?: string;
          user_id: string;
          from_plan: "free" | "standard" | "pro";
          to_plan: "free" | "standard" | "pro";
          payment_status?: "not_required" | "pending" | "completed" | "failed";
          stripe_session_id?: string | null;
          changed_via?: "signup" | "settings" | "admin" | "stripe_webhook";
          created_at?: string;
        };
        Update: {
          payment_status?: "not_required" | "pending" | "completed" | "failed";
          stripe_session_id?: string | null;
        };
        Relationships: [];
      };
      user_consents: {
        Row: UserConsent;
        Insert: {
          id?: string;
          user_id: string;
          consent_type: string;
          document_title: string;
          document_version: string;
          agreed_at?: string;
          created_at?: string;
        };
        Update: {
          document_title?: string;
          document_version?: string;
          agreed_at?: string;
        };
        Relationships: [];
      };
      user_referral_codes: {
        Row: UserReferralCode;
        Insert: {
          user_id: string;
          referral_code: string;
          referral_url: string;
          status?: "active" | "disabled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          referral_code?: string;
          referral_url?: string;
          status?: "active" | "disabled";
          updated_at?: string;
        };
        Relationships: [];
      };
      user_notifications: {
        Row: UserNotification;
        Insert: {
          id?: string;
          user_id: string;
          kind?:
            | "notification"
            | "announcement"
            | "collab_request"
            | "collab_accepted"
            | "collab_declined"
            | "fan_registered"
            | "artwork_liked"
            | "artwork_commented"
            | "lab_post"
            | "order_paid"
            | "support_reply";
          title: string;
          body?: string | null;
          href?: string | null;
          collab_request_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          kind?:
            | "notification"
            | "announcement"
            | "collab_request"
            | "collab_accepted"
            | "collab_declined"
            | "fan_registered"
            | "artwork_liked"
            | "artwork_commented"
            | "lab_post"
            | "order_paid"
            | "support_reply";
          title?: string;
          body?: string | null;
          href?: string | null;
          collab_request_id?: string | null;
          is_read?: boolean;
        };
        Relationships: [];
      };
      collab_labs: {
        Row: CollabLab;
        Insert: {
          id?: string;
          artwork_id: string;
          collab_request_id: string;
          title: string;
          created_at?: string;
        };
        Update: {
          title?: string;
        };
        Relationships: [];
      };
      collab_lab_members: {
        Row: CollabLabMember;
        Insert: {
          lab_id: string;
          user_id: string;
          role?: "owner" | "collaborator";
          joined_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      collab_lab_posts: {
        Row: CollabLabPost;
        Insert: {
          id?: string;
          lab_id: string;
          author_id: string;
          body: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      award_user_exp: {
        Args: { p_action_type: string; p_reference_key?: string };
        Returns: number;
      };
      respond_to_collab_request: {
        Args: { p_request_id: string; p_action: string };
        Returns: string;
      };
    };
    Enums: {
      artwork_media_type: ArtworkMediaType;
      collab_request_status: CollabRequestStatus;
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
