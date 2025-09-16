import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd
from typing import List, Dict, Any
import json

class DocumentAnalyzer:
    """Non-agentic AI service using scikit-learn for document analysis"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.clause_clusters = None
        self.risk_model = None
        
    def analyze_document_similarity(self, documents: List[str]) -> Dict[str, Any]:
        """Analyze similarity between documents using TF-IDF"""
        try:
            tfidf_matrix = self.vectorizer.fit_transform(documents)
            similarity_matrix = cosine_similarity(tfidf_matrix)
            
            # Find most similar document pairs
            similarities = []
            for i in range(len(documents)):
                for j in range(i + 1, len(documents)):
                    similarities.append({
                        'doc1_index': i,
                        'doc2_index': j,
                        'similarity': similarity_matrix[i][j]
                    })
            
            # Sort by similarity
            similarities.sort(key=lambda x: x['similarity'], reverse=True)
            
            return {
                'similarity_matrix': similarity_matrix.tolist(),
                'top_similarities': similarities[:5],
                'average_similarity': np.mean(similarity_matrix)
            }
            
        except Exception as e:
            raise Exception(f"Error analyzing document similarity: {str(e)}")
    
    def cluster_clauses(self, clauses: List[str], n_clusters: int = 5) -> Dict[str, Any]:
        """Cluster clauses by content similarity"""
        try:
            if len(clauses) < n_clusters:
                n_clusters = len(clauses)
            
            tfidf_matrix = self.vectorizer.fit_transform(clauses)
            
            # Perform K-means clustering
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            cluster_labels = kmeans.fit_predict(tfidf_matrix)
            
            # Organize results
            clusters = {}
            for i, label in enumerate(cluster_labels):
                if label not in clusters:
                    clusters[label] = []
                clusters[label].append({
                    'index': i,
                    'text': clauses[i],
                    'similarity_to_center': cosine_similarity(
                        tfidf_matrix[i:i+1], 
                        kmeans.cluster_centers_[label:label+1]
                    )[0][0]
                })
            
            # Get top terms for each cluster
            feature_names = self.vectorizer.get_feature_names_out()
            cluster_terms = {}
            for i, center in enumerate(kmeans.cluster_centers_):
                top_indices = center.argsort()[-10:][::-1]
                cluster_terms[i] = [feature_names[idx] for idx in top_indices]
            
            return {
                'clusters': clusters,
                'cluster_terms': cluster_terms,
                'n_clusters': n_clusters
            }
            
        except Exception as e:
            raise Exception(f"Error clustering clauses: {str(e)}")
    
    def calculate_risk_metrics(self, clause_text: str) -> Dict[str, Any]:
        """Calculate risk metrics for a clause using keyword analysis"""
        try:
            # Define risk indicators
            high_risk_terms = [
                'unlimited liability', 'personal guarantee', 'joint and several',
                'indemnify', 'hold harmless', 'liquidated damages', 'penalty',
                'irrevocable', 'perpetual', 'no limitation'
            ]
            
            medium_risk_terms = [
                'liable', 'damages', 'breach', 'default', 'terminate',
                'confidential', 'proprietary', 'exclusive', 'assignment'
            ]
            
            protective_terms = [
                'limitation of liability', 'caps', 'reasonable efforts',
                'commercially reasonable', 'force majeure', 'cure period'
            ]
            
            text_lower = clause_text.lower()
            
            # Count risk indicators
            high_risk_count = sum(1 for term in high_risk_terms if term in text_lower)
            medium_risk_count = sum(1 for term in medium_risk_terms if term in text_lower)
            protective_count = sum(1 for term in protective_terms if term in text_lower)
            
            # Calculate risk score (0-1 scale)
            risk_score = min(
                (high_risk_count * 0.3 + medium_risk_count * 0.1 - protective_count * 0.1) + 0.3,
                1.0
            )
            risk_score = max(risk_score, 0.0)
            
            # Determine risk level
            if risk_score >= 0.7:
                risk_level = "High"
            elif risk_score >= 0.4:
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            return {
                'risk_score': risk_score,
                'risk_level': risk_level,
                'high_risk_indicators': high_risk_count,
                'medium_risk_indicators': medium_risk_count,
                'protective_indicators': protective_count,
                'found_terms': {
                    'high_risk': [term for term in high_risk_terms if term in text_lower],
                    'medium_risk': [term for term in medium_risk_terms if term in text_lower],
                    'protective': [term for term in protective_terms if term in text_lower]
                }
            }
            
        except Exception as e:
            raise Exception(f"Error calculating risk metrics: {str(e)}")
    
    def extract_key_terms(self, text: str, n_terms: int = 10) -> List[str]:
        """Extract key terms from text using TF-IDF"""
        try:
            tfidf_matrix = self.vectorizer.fit_transform([text])
            feature_names = self.vectorizer.get_feature_names_out()
            tfidf_scores = tfidf_matrix.toarray()[0]
            
            # Get top terms
            top_indices = tfidf_scores.argsort()[-n_terms:][::-1]
            key_terms = [feature_names[idx] for idx in top_indices if tfidf_scores[idx] > 0]
            
            return key_terms
            
        except Exception as e:
            raise Exception(f"Error extracting key terms: {str(e)}")
    
    def analyze_contract_completeness(self, clauses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze if a contract has all necessary clause types"""
        try:
            # Define standard clause types for different contract types
            standard_clauses = {
                'general': [
                    'definitions', 'scope', 'payment', 'termination',
                    'confidentiality', 'governing_law', 'signatures'
                ],
                'service_agreement': [
                    'definitions', 'scope', 'payment', 'performance_standards',
                    'termination', 'confidentiality', 'liability', 'governing_law'
                ],
                'nda': [
                    'definitions', 'confidentiality', 'exceptions', 'term',
                    'return_of_information', 'remedies', 'governing_law'
                ]
            }
            
            # Extract clause types from provided clauses
            present_types = set()
            for clause in clauses:
                clause_type = clause.get('clause_type', '').lower()
                if clause_type:
                    present_types.add(clause_type)
            
            # Check completeness against standard contract
            required_clauses = set(standard_clauses['general'])
            missing_clauses = required_clauses - present_types
            extra_clauses = present_types - required_clauses
            
            completeness_score = len(required_clauses & present_types) / len(required_clauses)
            
            return {
                'completeness_score': completeness_score,
                'missing_clauses': list(missing_clauses),
                'present_clauses': list(present_types),
                'extra_clauses': list(extra_clauses),
                'recommendations': [
                    f"Add {clause} clause" for clause in missing_clauses
                ]
            }
            
        except Exception as e:
            raise Exception(f"Error analyzing contract completeness: {str(e)}")
    
    def generate_insights_report(self, document_text: str, clauses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate comprehensive insights report"""
        try:
            # Extract key terms
            key_terms = self.extract_key_terms(document_text)
            
            # Analyze completeness
            completeness = self.analyze_contract_completeness(clauses)
            
            # Calculate overall risk
            clause_risks = []
            for clause in clauses:
                risk_metrics = self.calculate_risk_metrics(clause.get('text', ''))
                clause_risks.append(risk_metrics['risk_score'])
            
            avg_risk = np.mean(clause_risks) if clause_risks else 0.5
            
            return {
                'key_terms': key_terms,
                'completeness_analysis': completeness,
                'risk_analysis': {
                    'average_risk_score': avg_risk,
                    'high_risk_clauses': len([r for r in clause_risks if r >= 0.7]),
                    'medium_risk_clauses': len([r for r in clause_risks if 0.4 <= r < 0.7]),
                    'low_risk_clauses': len([r for r in clause_risks if r < 0.4])
                },
                'document_length': len(document_text.split()),
                'clause_count': len(clauses),
                'generated_at': pd.Timestamp.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Error generating insights report: {str(e)}")