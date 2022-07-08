import test from 'ava'
import * as C from './citations'
import { FirebaseService } from './firebase.service'
const fetch = require('node-fetch')

test('Toms Guide', async t => {
  /**
   * Expect bibtex
   * @misc{ps5-vs-ps4-load-times-he, title={PS5 load times tested — now this is an upgrade}, author={Andronico, Michael}, url={https://www.tomsguide.com/news/ps5-vs-ps4-load-times-heres-how-much-faster-it-is}, publisher={Tom's Guide}}
   */
  const tomsGuide = 'https://www.tomsguide.com/news/ps5-vs-ps4-load-times-heres-how-much-faster-it-is'
  const firebase = new FirebaseService()
  const html = await C.getDirectHTML(firebase, tomsGuide)
  t.is(C.getId(tomsGuide), 'ps5-vs-ps4-load-times-he')
  t.deepEqual(C.getAuthors(html), [{first: 'Michael', last: 'Andronico'}])
  t.deepEqual(C.getTitles(html), {
    title: 'PS5 load times tested — now this is an upgrade',
    publisher: `Tom's Guide`
  })
  const generatedCitation = await C.linkCitePreprocessor(firebase, fetch, tomsGuide)
  t.is(generatedCitation, `@misc{ps5-vs-ps4-load-times-he, title={PS5 load times tested — now this is an upgrade}, author={Andronico, Michael}, url={https://www.tomsguide.com/news/ps5-vs-ps4-load-times-heres-how-much-faster-it-is}, publisher={Tom's Guide}}`)
})

test('IEEE Xplore DOI', async t => {
  const smartgrid = `https://ieeexplore.ieee.org/document/6598993`
  const firebase = new FirebaseService()
  const generatedCitation = await C.linkCitePreprocessor(firebase, fetch, smartgrid)
  t.true(generatedCitation.includes(`doi = {10.1109/ieeestd.2013.6598993}`))
  t.true(generatedCitation.includes(`url = {https://doi.org/10.1109%2Fieeestd.2013.6598993}`))
  t.true(generatedCitation.includes(`publisher = {{IEEE}}`))
  t.true(generatedCitation.includes(`title = {{IEEE} Vision for Smart Grid Controls: 2030 and Beyond Reference Model}`))
})
