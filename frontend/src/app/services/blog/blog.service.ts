import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = 'http://localhost:8084/api/blogs';

  constructor(private http: HttpClient) {}

  //static blogs
  blogData = [
    {
      id: 6,
      title: "BLACK FRIDAY ... réduction sur vos locations de voiture !",
      author: "admin",
      date: "22 Nov, 2024",
      time: "9h",
      imgUrl: "../../assets/all-images/blog-img/blog-9.jpg",
      description: "BLACK FRIDAY : 20% de réduction sur vos locations de voiture ! 🚗 📅 Offre valable pendant 3 jours seulement ! Profitez de 20% de réduction sur toutes nos locations de voiture pour partir à l'aventure ou répondre à vos besoins de mobilité.👉 Réservez vite et économisez ! +216 27 932 190 Ne manquez pas cette opportunité exclusive !",
      quote: "#myloc #blackfriday #locatindevoiture",
    },
    {
      id: 5,
      title: "Un service sur mesure...",
      author: "admin",
      date: "21 Nov, 2024",
      time: "10h",
      imgUrl: "../../assets/all-images/blog-img/blog-8.jpg",
      description: "✨ Un service sur mesure : Chauffeur et véhicule à votre disposition pour tous vos déplacements. 🌍🚘",
      quote: "#myloc #chauffeur #visite #tourisme #shopping #ServicePremium #deplacement",
    },
    {
      id: 1,
      title: "Découvrez Notre Large Gamme De Véhicules Adaptée à Tous Vos Besoins",
      author: "admin",
      date: "20 Nov, 2024",
      time: "14h",
      imgUrl: "../../assets/all-images/blog-img/blog-7.jpg",
      description: "Explorez notre gamme de véhicules, conçue pour répondre à toutes vos envies et besoins. ✨🚗",
      quote: "#MyLoc #ChoixInfini #citadines #berline #suv #luxe #VotreStyleVotreVoiture",
    },
    {
      id: 2,
      title: "Faites de votre mariage un moment mémorable avec notre Mercedes G-Classe ✨",
      author: "admin",
      date: "19 Nov, 2024",
      time: "13h",
      imgUrl: "../../assets/all-images/blog-img/blog-6.jpg",
      description: "Arrivez avec élégance et style à votre grand jour. 💍🚘 ✅ Luxe incomparable✅ Confort absolu✅ Parfait pour des photos inoubliables",
      quote: "#myloc #mariagetunise #mariagetunsie #mariageTN #chauffeur",
    },
    {
      id: 3,
      title: "Coming Soon...",
      author: "admin",
      date: "15 Nov, 2024",
      time: "11h",
      imgUrl: "assets/all-images/blog-img/blog-5.jpg",
      description: "Coming Soon...L'attente est presque terminée ! Prêt(e) à vivre l’expérience de luxe sur la route ? Restez connectés pour plus de détails et soyez parmi les premiers à prendre le volant ! 🔥",
      quote: "#MercedesCLE #ComingSoon #LocationDeVoiture #ConduiteDeLuxe #MyLoc #NouvelleVoiture #MercedesBenz #LuxeSurLaRoute #VitesseEtConfort",
    },
    {
      id: 4,
      title: "Annonce De Partenariat",
      author: "admin",
      date: "15 Nov, 2024",
      time: "9h",
      imgUrl: "../../assets/all-images/blog-img/blog-4.jpg",
      description: "Grâce à cette collaboration, nous mettons à disposition des solutions de mobilité sur-mesure, garantissant la sécurité, la fiabilité et le confort pour les déplacements professionnels 🤝 Ensemble, nous offrons des services adaptés aux besoins de GLOBAL ENR, afin de soutenir leur croissance et de faciliter la logistique des équipes.",
      quote: "#Partenariat #MobilitéProfessionnelle #TransfertDePersonnel #LocationDeVoitures #GLOBALENR #ServiceDeQualité",
    },
  ];

  // Get all blogs (dynamically from backend or static as fallback)
  getAllBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`).pipe(
      catchError(() => of(this.blogData))  // Fallback to static data if API fails
    );
  }

  // Get blog by ID (dynamically from backend or static as fallback)
  getBlogById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => of(this.blogData.find(blog => blog.id === id)))  // Fallback to static data
    );
  }

  // Get blog with comments
  getBlogWithComments(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/with-comments`);
  }

  // Add a new blog
  addBlog(blog: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, blog);
  }

  // Delete blog by ID
  deleteBlog(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Add comment to a specific blog
  addCommentToBlog(blogId: number, comment: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${blogId}/comments`, comment);
  }

  // Get other blogs (for sidebar)
  getOtherBlogs(currentBlogId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/other/${currentBlogId}`);
  }

  // Static method to return local blog data
  getStaticBlogs() {
    return this.blogData;
  }

  // Static method to get a blog by ID from static data
  getStaticBlogById(id: number) {
    return this.blogData.find(blog => blog.id === id);
  }

  // Static method to get other blogs (excluding the current blog) from static data
  getStaticOtherBlogs(currentBlogId: number) {
    return this.blogData.filter(blog => blog.id !== currentBlogId);
  }
}
