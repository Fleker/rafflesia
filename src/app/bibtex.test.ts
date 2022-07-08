import test from 'ava'
import * as B from './bibtex'

test('Parse Signal Integrity', t => {
  const bibtex = `@INPROCEEDINGS{ddr3,
    author={ {Cheng-Kuan Chen} and W. {Guo} and  {Chun-Huang Yu} and R. {Wu}},
    booktitle={2008 Electrical Design of Advanced Packaging and Systems Symposium}, 
    title={Signal integrity analysis of DDR3 high-speed memory module}, 
    year={2008},
    volume={},
    number={},
    pages={101-104},
    abstract={In this paper, a complete simulation methodology is introduced to analyze the signal integrity in a double data rate (DDR3) high-speed memory module. The equivalent models of the first-level package and various discontinuities in printed circuit board (PCB) are extracted, and then linked together by using general transmission-line models for the interconnections. Good agreements between the simulated and measured scattering parameters have confirmed the practicability of the simulation methodology. The fly-by structure is found to be crucial and thinner transmission lines around the synchronous dynamic random memory (SDRAM) region should be employed for achieving impedance matching with suitable design graph constructed accordingly. Finally, the effects of these models on the eye diagram are simulated to access their significance, for which the fly-by design is found to be the most critical, followed in order by package connections, via transitions, serpentine delay lines, and bends.},
    keywords={delay lines;DRAM chips;equivalent circuits;impedance matching;integrated circuit interconnections;integrated circuit modelling;printed circuits;transmission lines;signal integrity analysis;DDR3;double data rate high-speed memory module;printed circuit board;first-level package;equivalent circuit model;transmission-line models;interconnections;synchronous dynamic random memory;impedance matching;eye diagram;fly-by design;serpentine delay lines;Signal analysis;Circuit simulation;Packaging;Analytical models;Transmission line discontinuities;Printed circuits;Data mining;Transmission lines;Integrated circuit interconnections;Transmission line measurements},
    doi={10.1109/EDAPS.2008.4736009},
    ISSN={2151-1233},
    month={Dec},
  }`
  const citation = B.parseBibtexString(bibtex)
  t.is(citation.type, 'INPROCEEDINGS')
  t.is(citation.id, 'ddr3')
  t.is(citation.ISSN, '2151-1233')
  t.is(citation.month, 'Dec')
  t.is(citation.title, 'Signal integrity analysis of DDR3 high-speed memory module')
  t.deepEqual(Object.keys(citation), [
    'type',
    'id',
    'author',
    'booktitle',
    'title',
    'year',
    'volume',
    'number',
    'pages',
    'abstract',
    'keywords',
    'doi',
    'ISSN',
    'month',
  ])
})

test('Bibtex URLs', t => {
  const bibtex = `@INPROCEEDINGS{ddr3,
    author={ {Cheng-Kuan Chen} and W. {Guo} and  {Chun-Huang Yu} and R. {Wu}},
    booktitle={2008 Electrical Design of Advanced Packaging and Systems Symposium}, 
    title={Signal integrity analysis of DDR3 high-speed memory module}, 
    year={2008},
    volume={},
    number={},
    pages={101-104},
    abstract={In this paper, a complete simulation methodology is introduced to analyze the signal integrity in a double data rate (DDR3) high-speed memory module. The equivalent models of the first-level package and various discontinuities in printed circuit board (PCB) are extracted, and then linked together by using general transmission-line models for the interconnections. Good agreements between the simulated and measured scattering parameters have confirmed the practicability of the simulation methodology. The fly-by structure is found to be crucial and thinner transmission lines around the synchronous dynamic random memory (SDRAM) region should be employed for achieving impedance matching with suitable design graph constructed accordingly. Finally, the effects of these models on the eye diagram are simulated to access their significance, for which the fly-by design is found to be the most critical, followed in order by package connections, via transitions, serpentine delay lines, and bends.},
    keywords={delay lines;DRAM chips;equivalent circuits;impedance matching;integrated circuit interconnections;integrated circuit modelling;printed circuits;transmission lines;signal integrity analysis;DDR3;double data rate high-speed memory module;printed circuit board;first-level package;equivalent circuit model;transmission-line models;interconnections;synchronous dynamic random memory;impedance matching;eye diagram;fly-by design;serpentine delay lines;Signal analysis;Circuit simulation;Packaging;Analytical models;Transmission line discontinuities;Printed circuits;Data mining;Transmission lines;Integrated circuit interconnections;Transmission line measurements},
    doi={10.1109/EDAPS.2008.4736009},
    ISSN={2151-1233},
    month={Dec},
  }`
  const citation = B.parseBibtexString(bibtex)
  t.is(B.getExternalLink(citation), 'https://doi.org/10.1109/EDAPS.2008.4736009')

  const bibtex2 = `@inproceedings {flashblade,
    author = {Ning Zheng and Xubin Chen and Jiangpeng Li and Qi Wu and Yang Liu and Yong Peng and Fei Sun and Hao Zhong and Tong Zhang},
    title = {Re-think Data Management Software Design Upon the Arrival of Storage Hardware with Built-in Transparent Compression},
    booktitle = {12th {USENIX} Workshop on Hot Topics in Storage and File Systems (HotStorage 20)},
    year = {2020},
    url = {https://www.usenix.org/conference/hotstorage20/presentation/zheng},
    publisher = {{USENIX} Association},
    month = {jul},
    }`
  const citation2 = B.parseBibtexString(bibtex2)
  t.is(B.getExternalLink(citation2), 'https://www.usenix.org/conference/hotstorage20/presentation/zheng')
})
