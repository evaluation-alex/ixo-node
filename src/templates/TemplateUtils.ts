import {GitUtils} from './GitUtils';
import {TemplateSchema} from './TemplateSchema';

var templateCache = new Map<string, SchemaFormTemplate>();

export class SchemaFormTemplate {
  template: any;
  form: any;

  constructor(template: any, form: any){
    this.template = new TemplateSchema(template);
    this.form = form;
  }

  asJSON(): any {
    return {template: this.template.getSchema(), form: this.form};
  }

}

export class TemplateUtils { 

  gitUtils: GitUtils
  repoName: string

  constructor(){
    this.gitUtils = new GitUtils();
    this.repoName = 'ixofoundation';
  }

  /*
    Returns the Template and the corresponding form for the name supplied
  */
  getTemplate(templateType: string, name: string){
    var key = this.getCacheKey(templateType, name);
    if(templateCache.has(key)){
      return new Promise((resolve: Function, reject: Function) => {
        var template = templateCache.get(key);
        if(template){
          resolve(template.asJSON());
        }else{
          reject();
        }
        
      })
    }

    var template = this.constructTemplate(templateType, name);
    var form = this.constructForm(templateType,name);

    return this.gitUtils.loadFileContents(this.repoName, template)
      .then((templateContents: any) => {
        return this.gitUtils.loadFileContents(this.repoName, form)
        .then((formContents: any) =>{
          var res = new SchemaFormTemplate(JSON.parse(templateContents), JSON.parse(formContents));
          templateCache.set(key, res);
          return res.asJSON();
        });
      });
  }

  getCacheKey(templateType: string, name: string): string {
    return (templateType + "|" + name).toString();
  }

  validateData(data: any, templateType: string, templateName: string){
    return this.getTemplate(templateType, name).then((content) => {
      return content.template.isValidForData(data);
    });
  }

  // Utilities
  constructTemplate(templateType: string, name: string){
    return "/" + templateType + "/" + name + ".json";
  }

  constructForm(templateType: string, name: string){
    return "/" + templateType + "/" + name + "_form.json";
  }
  
}

export default TemplateUtils;