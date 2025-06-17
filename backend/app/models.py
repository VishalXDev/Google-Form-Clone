from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Field(Base):
    __tablename__ = "fields"
    
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(255), nullable=False)  # Added length and not null
    field_type = Column(String(50), nullable=False)  # "text", "number", "single_choice"
    options = Column(Text, nullable=True)  # JSON string for choices
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Field(id={self.id}, label='{self.label}', type='{self.field_type}')>"

class Form(Base):
    __tablename__ = "forms"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)  # Added length and not null
    unique_link = Column(String(50), unique=True, index=True, nullable=False)
    fields = Column(Text, nullable=False)  # JSON of field IDs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to responses
    responses = relationship("Response", back_populates="form", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Form(id={self.id}, title='{self.title}', link='{self.unique_link}')>"

class Response(Base):
    __tablename__ = "responses"
    
    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False)
    answers = Column(Text, nullable=False)  # JSON object {field_id: answer}
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to form
    form = relationship("Form", back_populates="responses")
    
    def __repr__(self):
        return f"<Response(id={self.id}, form_id={self.form_id}, submitted_at={self.submitted_at})>"