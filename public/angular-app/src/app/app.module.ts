import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MoviesComponent } from './movies/movies.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MovieComponent } from './movie/movie.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { FooterComponent } from './footer/footer.component';
import { ActorsComponent } from './actors/actors.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import { AddActorComponent } from './addActor/addActor.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { SearchComponent } from './search/search.component';
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MoviesComponent,
    MovieComponent,
    ErrorPageComponent,
    AddMovieComponent,
    FooterComponent,
    ActorsComponent,
    AddActorComponent,
    RegisterComponent,
    UsersComponent,
    LoginComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    RouterModule.forRoot([
      {
        path: "",
        component: HomePageComponent
      },
      {
        path: "movies",
        component: MoviesComponent
      },
      {
        path: "movies/:movieId",
        component: MovieComponent
      },
      {
        path: "addmovie",
        component: AddMovieComponent
      }
      ,
      {
        path: "register",
        component: RegisterComponent
      },
      {
        path: "users",
        component: UsersComponent
      }
      ,
      {
        path: "search",
        component: SearchComponent
      },
      {
        path: "**",
        component: ErrorPageComponent
      }
    ])
  ],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandlerService },{provide:JWT_OPTIONS,  useValue:JWT_OPTIONS},{
	  provide: HTTP_INTERCEPTORS,
	  useClass: TokenInterceptorService,
	  multi: true,
	},  JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
