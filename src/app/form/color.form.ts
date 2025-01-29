import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ColorGroup } from "../interface/color-group";

export class ColorForm {
    colorGroup: ColorGroup;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.colorGroup = this._parentComponent.colorGroup || new ColorGroup();
        
        this.form = this.formBuilder.group({
            header_1: [
                this.colorGroup.headerGradient ? '#' + this.colorGroup.header.split('#')[1].replace(',', '').trim() : this.colorGroup.header, 
                [Validators.required]
            ],
            header_2: [
                this.colorGroup.headerGradient ? '#' + this.colorGroup.header.split('#')[2].replace(')', '') : null
            ],
            headerGradient: [
                this.colorGroup.headerGradient
            ],
            footer_1: [
                this.colorGroup.footerGradient ? '#' + this.colorGroup.footer.split('#')[1].replace(',', '').trim() : this.colorGroup.footer, 
                [Validators.required]
            ],
            footer_2: [
                this.colorGroup.footerGradient ? '#' + this.colorGroup.footer.split('#')[2].replace(')', '') : null
            ],
            footerGradient: [
                this.colorGroup.footerGradient
            ],
            btn_1: [
                this.colorGroup.btnGradient ? '#' + this.colorGroup.btn.split('#')[1].replace(',', '').trim() : this.colorGroup.btn, 
                [Validators.required]
            ],
            btn_2: [
                this.colorGroup.btnGradient ? '#' + this.colorGroup.btn.split('#')[2].replace(')', '') : null
            ],
            btnGradient: [
                this.colorGroup.btnGradient
            ],
            link: [
                this.colorGroup.link, [Validators.required]
            ]
        });
    }

    get header_1() { return this.form.get('header_1') }
    get header_2() { return this.form.get('header_2') }

    get headerGradient() { return this.form.get('headerGradient') }

    get footer_1() { return this.form.get('footer_1') }
    get footer_2() { return this.form.get('footer_2') }

    get footerGradient() { return this.form.get('footerGradient') }

    get btn_1() { return this.form.get('btn_1') }
    get btn_2() { return this.form.get('btn_2') }

    get btnGradient() { return this.form.get('btnGradient') }

    get link() { return this.form.get('link') }

}