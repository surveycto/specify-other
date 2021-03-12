# Baseline select_one and select_multiple

|<img src="extras/readme-images/baseline-select_one-likert.jpg" width="100px">|<img src="extras/readme-images/select_multiple.jpg" width="100px">|
|:---:|:---:|
|*select_one* likert|*select_multiple*|

## Description

This is a combination of the baseline *[select_one](https://github.com/surveycto/baseline-select_one)* and *[select_multiple](https://github.com/surveycto/baseline-select_multiple)* field plug-ins, in case you would like your field plug-in to work with either field type. To learn more, check out those repositories.

In addition, this field plug-in also supports the "label" and "list-nolabel" *appearance*s, so it can be used for creating field list grids. To learn more, check out our documentation on [field lists](https://docs.surveycto.com/02-designing-forms/04-sample-forms/05.field-lists.html).

[![Download now](extras/readme-images/download-button.png)](https://github.com/surveycto/select_one-select_multiple/raw/master/select_one-select_multiple.fieldplugin.zip)

## Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `select_one`, `select_multiple`|
| Default values | Yes |
| Custom constraint message | Yes |
| Custom required message | Yes |
| Read only | Yes |
| media:image | Yes |
| media:audio | Yes |
| media:video | Yes |
| `quick` appearance | Yes (`select_one` only) |
| `minimal` appearance | Yes (`select_one` only) |
| `compact` appearance | No |
| `compact-#` appearance | No |
| `quickcompact` appearance | No |
| `quickcompact-#` appearance | No |
| `likert` appearance | Yes (`select_one` only) |
| `likert-min` appearance | Yes* (`select_one` only) |
| `likert-mid` appearance | No |
| `label` appearance | Yes |
| `list-nolabel` appearance | Yes |


*Note: this plug-in works well for the likert-min appearance when the field label is short, and does not contain an image, audio, or video. This is currently a known limitation.

## How to use

**To use this plug-in as-is**, just download the [select_one-select_multiple.fieldplugin.zip](https://github.com/surveycto/select_one-select_multiple/raw/master/select_one-select_multiple.fieldplugin.zip) file from this repo, and attach it to your form.

To create your own field plug-in using this as a template, follow these steps:

1. Fork this repo
1. Make changes to the files in the `source` directory.

    * **Note:** be sure to update the `manifest.json` file as well.

1. Zip the updated contents of the `source` directory.
1. Rename the .zip file to *yourpluginname*.fieldplugin.zip (replace *yourpluginname* with the name you want to use for your plug-in).
1. You may then attach your new .fieldplugin.zip file to your form as normal.

## More resources

* **Test form**  
This form will help you test to make sure your new field plug-in works with different *select_one* and *select_multiple* fields. Click [here](https://github.com/surveycto/select_one-select_multiple/blob/master/extras/test-form/Test%20form%20and%20media.zip?raw=true) to download a ZIP file with the test files. Decompress the test file, and there will be a form definition spreadsheet and another ZIP file. Upload that form to your server with that file "media.zip" attached (you do not have to decompress "media.zip", but you can if you'd like).

* **Developer documentation**  
Instructions and resources for developing your own field plug-ins.  
[https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)

* **User documentation**  
How to get started using field plug-ins in your SurveyCTO form.  
[https://docs.surveycto.com/02-designing-forms/03-advanced-topics/06.using-field-plug-ins.html](https://docs.surveycto.com/02-designing-forms/03-advanced-topics/06.using-field-plug-ins.html)
