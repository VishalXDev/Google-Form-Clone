from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Field(Base):
    __tablename__ = "fields"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String)
    field_type = Column(String)  # "text", "number", "single_choice"
    options = Column(Text, nullable=True)  # JSON string for choices

class Form(Base):
    __tablename__ = "forms"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    unique_link = Column(String, unique=True, index=True)
    fields = Column(Text)  # JSON of field IDs

class Response(Base):
    __tablename__ = "responses"
    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"))
    answers = Column(Text)  # JSON object {field_id: answer}
