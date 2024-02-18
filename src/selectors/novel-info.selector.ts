const infoParentSelector = '#truyen > div.csstransforms3d > div > div.col-xs-12.col-info-desc';
const infoHeading = `${infoParentSelector} > div.title-list > h2`;
const descriptionSelector = `${infoParentSelector} > div.col-xs-12.col-sm-8.col-md-8.desc`
const title = `${descriptionSelector} > h3`;
const description = `${descriptionSelector} > div.desc-text`;
const latestChapters = `${descriptionSelector} > div.l-chapter > ul`;
const holderSelector = `${infoParentSelector} > div.col-xs-12.col-sm-4.col-md-4.info-holder > div`;
const image = `${holderSelector}.books > div.book > img`;
const childSelector = `${holderSelector}.info > div:nth-child`
const authors = `${childSelector}(1)`;
const alternativeNames = `${childSelector}(2)`;
const genres = `${childSelector}(3)`;
const source = `${childSelector}(4)`;
const status = `${childSelector}(5) > a`;


export default {
    infoHeading,
    title,
    description,
    latestChapters,
    image,
    authors,
    alternativeNames,
    genres,
    source,
    status,
}