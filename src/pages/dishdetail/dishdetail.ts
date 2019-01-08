import { Component,Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import {Dish} from '../../shared/dish';
import {FavoriteProvider} from '../../providers/favorite/favorite';
import {CommentPage} from '../../pages/comment/comment';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-dishdetail",
  templateUrl: "dishdetail.html"
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstar: string;
  numcomments: number;
  favorite: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    @Inject("BaseURL") private BaseURL,
    private favoriteservice: FavoriteProvider,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController
  ) {
    this.dish = navParams.get("dish");
    this.favorite = this.favoriteservice.isFavorite(this.dish.id);
    this.numcomments = this.dish.comments.length;

    let total = 0;
    this.dish.comments.forEach(comment => (total += comment.rating));
    this.avgstar = (total / this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad DishdetailPage");
  }
  addToFavorites() {
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl
      .create({
        message: "Dish " + this.dish.id + " added as a favorite successfully",
        position: "middle",
        duration: 3000
      })
      .present();
  }
  checkActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: "Select Actions",
      buttons: [
        {
          text: "Add to Favorites",
          handler: () => {
            this.addToFavorites();
          }
        },
        {
          text: "Add Comment",
          handler: () => {
            this.openCommentPage();
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }
  openCommentPage() {
    let modal = this.modalCtrl.create(CommentPage);
    modal.onDidDismiss(data => {
      if(data){
        this.dish.comments.push(data);
      }
    });
    modal.present();
  }
}
