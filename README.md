# Other choice

<img src="extras/readme-images/text_box_revealed.png" width="300px">

|<img src="extras/readme-images/blank_box.png" width="100px">|<img src="extras/readme-images/main_choice.png" width="100px">|
|:--:||:---:|
|Waiting for text||Main choice selected|

## Description

With this field plug-in, you can set it so when a specific choice is selected, a text box appears where the enumerator can enter a text response. This is helpful for fields that have an "Other" choice, so the enumerator can enter the "Other" response right on the same page.

[![Download now](extras/readme-images/download-button.png)](https://github.com/surveycto/other-choice/raw/master/other-choice.fieldplugin.zip)

## Features

* Able to enter a text response when a specific choice is selected.
* Choose which choice will make the text box appear.
* All of the capabilities of the [select_one-select_multiple](https://github.com/surveycto/select_one-select_multiple/blob/master/README.md) field plug-in.

## Data format

The field value will be the selected choice.

The data in the text box will be stored in the field plug-in metadata. To retrieve that text box data, use this expression:

    item-at('|', plug-in-metadata(${basic_hint-so}), 1)

You can add a [*calculate* field](https://docs.surveycto.com/02-designing-forms/01-core-concepts/03zb.field-types-calculate.html) with that *calculation*. Check out our documenation on [using expressions](https://docs.surveycto.com/02-designing-forms/01-core-concepts/09.expressions.html) to learn about the functions used.

The item-at() function is used because other data is stored in the metadata for internal purposes. You can simply use the above expression to retrieve the text box data.

If you'd like, you can give that *calculate* field a *[relevance](https://docs.surveycto.com/02-designing-forms/01-core-concepts/08.relevance.html)* expression so that it is only relevant if the "Other" choice was selected. For example, if the "Other" choice has a choice *value* of "-1", you can give the *calculate* field that retreives the metadata this *relevance* expression:

    selected(${crop_most}, '-1')

## How to use

### Getting started

*To use this plug-in as is:*

1. Download the [sample form](https://github.com/scto-sandbox/other-choice/raw/master/extras/sample-form/Other%20choice%20sample%20form.xlsx) from this repo, as well as the [media files ZIP file](https://github.com/scto-sandbox/other-choice/raw/master/extras/sample-form/media.zip). You can use the sample form as-is, or adjust the parameters to change the behavior (see below).
1. Download the other-choice.fieldplugin.zip file from this repo, and attach it to the sample form on your SurveyCTO server.
1. Upload the sample form to your server, with the media files ZIP file and the field plug-in attached.

Note: For simplicity, in the sample form, the field plug-in metadata is only retrieved for the first field. However, if you have multiple fields using this field plug-in, you can absolutely use the plug-in-metadata() function on each of those fields.

### Parameters

|Name|Description|
|:--|:--|
|`other` (optional)|The *value* of the choice where if it is selected, then the text box will appear. For example, if this parameter has a value of "-1", then when the choice with a *value* of "-1" is selected, the text box will appear. If this parameter has no value, then the last choice in the choice list will be used.|
|`required` (optional)|Normally, if the text box appears, then the enumerator cannot move forward until they enter data into that text box. If this parameter has a value of `0`, then they can leave that text box blank; it will also say "(optional)" in the placeholder text.|

### Special circumstance: Leaving the text box blank

If the field is not [*required*](https://docs.surveycto.com/02-designing-forms/01-core-concepts/05.other-columns.html), and the enumerator selects "Other", it is a good idea for them to enter the "Other" text box value before moving on. That way, they don't have to remember to come back later.

If the "Other" choice is selected, but the text box is left blank, and the `required` parameter is not defined, the field value will not be submitted to the server. The enumerator can go back-and-forth, and even save-and-close and re-open the form later, and the same choices will be selected. But, if the "Other" choice is selected, and they submit the form before the text box has a value, then the field value will become blank, even if it is a *select_multiple* field and other choices were selected.

Of course, if the field itself is *required*, then this will not be an issue, since the enumerator will have to give that text box a value before they can submit the form instance to the server. It is also fine if the `required` parameter has a value of `0`, since then the text box will not be required, and the field value will be saved.

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

## More resources

* **Developer documentation**  
Instructions and resources for developing your own field plug-ins.  
[https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)

* **User documentation**  
How to get started using field plug-ins in your SurveyCTO form.  
[https://docs.surveycto.com/02-designing-forms/03-advanced-topics/06.using-field-plug-ins.html](https://docs.surveycto.com/02-designing-forms/03-advanced-topics/06.using-field-plug-ins.html)
