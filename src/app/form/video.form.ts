import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Video } from "../interface/video";

export class VideoForm {
    video: Video;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.video = this._parentComponent.video || new Video();
        
        this.form = this.formBuilder.group({
            title: [
                this.video.title, [Validators.required]
            ],
            url: [
                this.video.url, [Validators.required]
            ],
            thumbnail: [
                this.video.thumbnail, [Validators.required]
            ],
            cover: [
                this.video.cover || false
            ]
        });
    }

    get title() { return this.form.get('title') }

    get url() { return this.form.get('url') }

    get thumbnail() { return this.form.get('thumbnail') }

    get cover() { return this.form.get('cover') }

}