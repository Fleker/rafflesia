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

  const bibtex2 = `@InProceedings{typescript,
    author="Bierman, Gavin
    and Abadi, Mart{\'i}n
    and Torgersen, Mads",
    editor="Jones, Richard",
    title="Understanding TypeScript",
    booktitle="ECOOP 2014 -- Object-Oriented Programming",
    year="2014",
    publisher="Springer Berlin Heidelberg",
    address="Berlin, Heidelberg",
    pages="257--281",
    abstract="TypeScript is an extension of JavaScript intended to enable easier development of large-scale JavaScript applications. While every JavaScript program is a TypeScript program, TypeScript offers a module system, classes, interfaces, and a rich gradual type system. The intention is that TypeScript provides a smooth transition for JavaScript programmers---well-established JavaScript programming idioms are supported without any major rewriting or annotations. One interesting consequence is that the TypeScript type system is not statically sound by design. The goal of this paper is to capture the essence of TypeScript by giving a precise definition of this type system on a core set of constructs of the language. Our main contribution, beyond the familiar advantages of a robust, mathematical formalization, is a refactoring into a safe inner fragment and an additional layer of unsafe rules.",
    isbn="978-3-662-44202-9"
    }`
  const citation2 = B.parseBibtexString(bibtex2)
  t.is(citation2.title, 'Understanding TypeScript')
  
  const bibtex3 = `@ARTICLE{thermal,  author={Zhou, Minxuan and Prodromou, Andreas and Wang, Rui and Yang, Hailong and Qian, Depei and Tullsen, Dean},  journal={IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems},   title={Temperature-Aware DRAM Cache Management—Relaxing Thermal Constraints in 3-D Systems},   year={2020},  volume={39},  number={10},  pages={1973-1986},  doi={10.1109/TCAD.2019.2927528}}`
  const citation3 = B.parseBibtexString(bibtex3)
  t.is(citation3.doi, '10.1109/TCAD.2019.2927528')
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

  const bibtex3 = ` @misc{nand_micron, title={Technical Note NAND Flash 101: An Introduction to NAND Flash and How to Design It In to Your Next Product}, url={https://user.eng.umd.edu/~blj/CS-590.26/micron-tn2919.pdf}, author={Micron Technology Inc}, year={2006}}`
  const citation3 = B.parseBibtexString(bibtex3)
  t.is(B.getExternalLink(citation3), 'https://user.eng.umd.edu/~blj/CS-590.26/micron-tn2919.pdf')

})
