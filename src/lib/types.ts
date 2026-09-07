export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          slug: string;
          google_review_url: string;
          logo_url: string | null;
          owner_user_id: string;
          plan: "trial" | "active" | "cancelled";
          status: "active" | "paused" | "cancelled";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          google_review_url: string;
          logo_url?: string | null;
          owner_user_id: string;
          plan?: "trial" | "active" | "cancelled";
          status?: "active" | "paused" | "cancelled";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          google_review_url?: string;
          logo_url?: string | null;
          owner_user_id?: string;
          plan?: "trial" | "active" | "cancelled";
          status?: "active" | "paused" | "cancelled";
          created_at?: string;
        };
      };
      business_members: {
        Row: {
          id: string;
          business_id: string;
          user_id: string;
          role: "owner" | "staff";
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          user_id: string;
          role?: "owner" | "staff";
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          user_id?: string;
          role?: "owner" | "staff";
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          business_id: string;
          rating: number;
          comment: string | null;
          customer_name: string | null;
          customer_contact: string | null;
          routed_to: "google" | "private_feedback";
          status: "new" | "read" | "resolved";
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          rating: number;
          comment?: string | null;
          customer_name?: string | null;
          customer_contact?: string | null;
          routed_to: "google" | "private_feedback";
          status?: "new" | "read" | "resolved";
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          rating?: number;
          comment?: string | null;
          customer_name?: string | null;
          customer_contact?: string | null;
          routed_to?: "google" | "private_feedback";
          status?: "new" | "read" | "resolved";
          created_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          business_id: string;
          card_uid: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          card_uid?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          card_uid?: string | null;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          business_id: string;
          type: "card_tap" | "review_submitted" | "google_redirect";
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          type: "card_tap" | "review_submitted" | "google_redirect";
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          type?: "card_tap" | "review_submitted" | "google_redirect";
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
};

export type Business = Database["public"]["Tables"]["businesses"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Card = Database["public"]["Tables"]["cards"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type BusinessMember = Database["public"]["Tables"]["business_members"]["Row"];
export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"];
