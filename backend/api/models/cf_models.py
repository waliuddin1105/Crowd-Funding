from datetime import datetime
from enum import Enum
from api import bcrypt 
from api import db


class DonationStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"


class UserRole(Enum):
    DONOR = "donor"
    CREATOR = "creator"
    ADMIN = "admin"


class CampaignStatus(Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PENDING = "pending"
    REJECTED = "rejected"


class CampaignCategory(Enum):
    EDUCATION = "education"
    HEALTHCARE = "healthcare"
    ENVIRONMENT = "environment"
    ANIMALS = "animals"
    OTHER = "other"

    PERSONAL = "personal"
    EMERGENCY = "emergency"
    CHARITY = "charity"
    MEDICAL= "medical"

class CampaignPaymentStatus(Enum):
    PENDING = "pending"
    SUCCESSFUL = "successful"
    FAILED = "failed"
    REFUNDED = "refunded"


class Users(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False)
    profile_image = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def setPasswordHash(self, password):
        self.password_hash = bcrypt.generate_password_hash(password)

    def checkHashedPassword(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "role": self.role.value if self.role else None,
            "profile_image": self.profile_image,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class Campaigns(db.Model):
    __tablename__ = "campaigns"

    campaign_id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.Enum(CampaignCategory), nullable=False)
    goal_amount = db.Column(db.Numeric(10, 2), nullable=False)
    raised_amount = db.Column(db.Numeric(10, 2), default=0)
    status = db.Column(db.Enum(CampaignStatus), default=CampaignStatus.PENDING)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    creator = db.relationship(
        "Users",
        backref=db.backref("campaigns", lazy=True, cascade="all, delete-orphan"),
    )

    comments = db.relationship(
        "Comments", backref="campaign", lazy=True, cascade="all, delete-orphan"
    )
    donations = db.relationship(
        "Donations", backref="campaign", lazy=True, cascade="all, delete-orphan"
    )
    follows = db.relationship(
        "Follows", backref="campaign", lazy=True, cascade="all, delete-orphan"
    )
    updates = db.relationship(
        "CampaignUpdates", backref="campaign", lazy=True, cascade="all, delete-orphan"
    )
    reviews = db.relationship(
        "AdminReviews", backref="campaign", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "campaign_id": self.campaign_id,
            "title": self.title,
            "short_description": self.short_description,
            "long_description": self.long_description,
            "category": self.category.value,
            "goal_amount": float(self.goal_amount),
            "raised_amount": float(self.raised_amount),
            "image_url": self.image_url,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "status": self.status.value,
            "created_at": self.created_at,
            "creator": (
                {
                    "user_id": self.creator.user_id,
                    "username": self.creator.username,
                    "profile_image": self.creator.profile_image,
                }
                if self.creator
                else None
            ),
        }


class Comments(db.Model):
    __tablename__ = "comments"

    comment_id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(
        db.Integer, db.ForeignKey("campaigns.campaign_id"), nullable=False
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    content = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)

    user = db.relationship(
        "Users", backref=db.backref("comments", lazy=True, cascade="all, delete-orphan")
    )

    liked_by_users = db.relationship(
        "Users", secondary="user_comment_likes", back_populates="liked_comments"
    )

    def to_dict(self):
        return {
            "comment_id": self.comment_id,
            "content": self.content,
            "likes": self.likes,
            "created_at": self.created_at,
            "user": (
                {
                    "user_id": self.user.user_id,
                    "username": self.user.username,
                    "profile_image": self.user.profile_image,
                }
                if self.user
                else None
            ),
            "campaign": (
                {"campaign_id": self.campaign.campaign_id, "title": self.campaign.title}
                if self.campaign
                else None
            ),
        }


class Payments(db.Model):
    __tablename__ = "payments"

    payment_id = db.Column(db.Integer, primary_key=True)
    donation_id = db.Column(
        db.Integer, db.ForeignKey("donations.donation_id"), nullable=False
    )
    amount = db.Column(db.Numeric(8, 2), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    payment_status = db.Column(db.Enum(CampaignPaymentStatus), nullable=False)
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    donation = db.relationship(
        "Donations",
        backref=db.backref("payments", lazy=True, cascade="all, delete-orphan"),
    )

    def to_dict(self):
        return {
            "payment_id": self.payment_id,
            "amount": float(self.amount),
            "payment_method": self.payment_method,
            "payment_status": self.payment_status.value,
            "transaction_date": self.transaction_date,
            "donation": (
                {
                    "donation_id": self.donation.donation_id,
                    "amount": float(self.donation.amount),
                    "donor": (
                        {
                            "user_id": self.donation.donor.user_id,
                            "username": self.donation.donor.username,
                        }
                        if self.donation and self.donation.donor
                        else None
                    ),
                    "campaign": (
                        {
                            "campaign_id": self.donation.campaign.campaign_id,
                            "title": self.donation.campaign.title,
                        }
                        if self.donation and self.donation.campaign
                        else None
                    ),
                }
                if self.donation
                else None
            ),
        }


class Donations(db.Model):
    __tablename__ = "donations"

    donation_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    campaign_id = db.Column(
        db.Integer, db.ForeignKey("campaigns.campaign_id"), nullable=False
    )
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.Enum(DonationStatus), default=DonationStatus.PENDING)
    user = db.relationship(
        "Users",
        backref=db.backref("donations", lazy=True, cascade="all, delete-orphan"),
    )

    def to_dict(self):
        return {
            "donation_id": self.donation_id,
            "amount": float(self.amount),
            "donation_date": self.donation_date,
            "message": self.message,
            "status": self.status.value,
            "donor": (
                {
                    "user_id": self.donor.user_id,
                    "username": self.donor.username,
                    "profile_image": self.donor.profile_image,
                }
                if self.donor
                else None
            ),
            "campaign": (
                {"campaign_id": self.campaign.campaign_id, "title": self.campaign.title}
                if self.campaign
                else None
            ),
        }


class Follows(db.Model):
    __tablename__ = "follows"

    follow_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    campaign_id = db.Column(
        db.Integer, db.ForeignKey("campaigns.campaign_id"), nullable=False
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship(
        "Users", backref=db.backref("follows", lazy=True, cascade="all, delete-orphan")
    )

    def to_dict(self):
        return {
            "follow_id": self.follow_id,
            "followed_at": self.followed_at,
            "user": (
                {
                    "user_id": self.user.user_id,
                    "username": self.user.username,
                    "profile_image": self.user.profile_image,
                }
                if self.user
                else None
            ),
            "campaign": (
                {"campaign_id": self.campaign.campaign_id, "title": self.campaign.title}
                if self.campaign
                else None
            ),
        }


class CampaignUpdates(db.Model):
    __tablename__ = "campaign_updates"

    update_id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(
        db.Integer, db.ForeignKey("campaigns.campaign_id"), nullable=False
    )
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "update_id": self.update_id,
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at,
            "campaign": (
                {"campaign_id": self.campaign.campaign_id, "title": self.campaign.title}
                if self.campaign
                else None
            ),
            "user": (
                {"user_id": self.user.user_id, "username": self.user.username}
                if self.user
                else None
            ),
        }


class AdminReviews(db.Model):
    __tablename__ = "admin_reviews"

    review_id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    campaign_id = db.Column(
        db.Integer, db.ForeignKey("campaigns.campaign_id"), nullable=False
    )
    decision = db.Column(db.String(20), nullable=False)
    comments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    admin = db.relationship(
        "Users",
        backref=db.backref("admin_reviews", lazy=True, cascade="all, delete-orphan"),
    )

    def to_dict(self):
        return {
            "review_id": self.review_id,
            "decision": self.decision.value if self.decision else None,
            "comments": self.reason,
            "reviewed_at": self.reviewed_at,
            "admin": (
                {"user_id": self.admin.user_id, "username": self.admin.username}
                if self.admin
                else None
            ),
            "campaign": (
                {"campaign_id": self.campaign.campaign_id, "title": self.campaign.title}
                if self.campaign
                else None
            ),
        }


user_comment_likes = db.Table(
    "user_comment_likes",
    db.Column("user_id", db.Integer, db.ForeignKey("users.user_id"), primary_key=True),
    db.Column(
        "comment_id", db.Integer, db.ForeignKey("comments.comment_id"), primary_key=True
    ),
)
