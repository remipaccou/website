"""English versions of two timelines of the thesis, for the site.

The French TikZ sources come from remipaccou/Remi-Thesis-GIT-Material
(notes/esquisses/, 11 October 2026). This script writes an English copy of
each by replacing its labels, then build.sh compiles both languages and
exports them as SVG into public/figures/.

  python3 -I figures-src/translate.py

Any French left in an English file is printed, so that nothing slips through.
"""
import re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

# Typography shared by both: French spaces before : and ;, decimal commas.
COMMON = [('~:', ':'), ('~;', ';'), ('99,99~\\%', '99.99\\%'), ('99,9~\\%', '99.9\\%'), ('94~\\%', '94\\%')]

TRANSMIT = [
    ('{transmettre}', '{transmit}'),
    ('{vers calculer}', '{to compute}'),
    ('{sémaphore français}', '{French semaphore}'),
    ('1837 brevets Morse, Cooke\\\\1844 \\emph{ligne Washington--Baltimore,}\\\\\\emph{commande publique}',
     '1837 Morse, Cooke patents\\\\1844 \\emph{Washington--Baltimore line,}\\\\\\emph{public commission}'),
    ('\\emph{premier monopole privé}', '\\emph{first private monopoly}'),
    ('télégraphe~: le trafic décline,\\\\\\emph{les actifs se louent au téléphone}', 'telegraph: traffic declines,\\\\\\emph{its assets are leased to the telephone}'),
    ('\\emph{block system} proposé~: la technique existe, le payeur manque', '\\emph{block system} proposed: the technique exists, the payer is missing'),
    ('1889 obligatoire\\\\\\emph{après Armagh}', '1889 mandatory\\\\\\emph{after Armagh}'),
    ('1876 brevet~; 1877 Bell~:\\\\\\emph{location, concessions}', '1876 patent; 1877 Bell:\\\\\\emph{leasing, franchises}'),
    ('1879 accord Western Union~:\\\\\\emph{deux industries séparées}', '1879 Western Union agreement:\\\\\\emph{two separate industries}'),
    ('1894 expiration\\\\\\emph{6\\,000 indépendants}', '1894 patents expire\\\\\\emph{6,000 independents}'),
    ('\\emph{régulation négociée}', '\\emph{negotiated regulation}'),
    ('1919 commutation\\\\automatique adoptée', '1919 automatic\\\\switching adopted'),
    ('téléphonie~: le réseau\\\\Bell reconsolidé', 'telephony: the Bell\\\\network reconsolidated'),
    ('\\emph{le central automatique chez les indépendants}', '\\emph{automatic exchanges for independents}'),
    ('1896 brevet~; 1897 Marconi~: \\emph{brevets,}\\\\\\emph{location, refus d\'interopérabilité}', '1896 patent; 1897 Marconi: \\emph{patents,}\\\\\\emph{leasing, refusal to interoperate}'),
    ('1912 \\emph{Titanic}~: la veille\\\\\\emph{radio imposée}', '1912 \\emph{Titanic}: the radio watch\\\\\\emph{made compulsory}'),
    ('1919 RCA~: \\emph{monopole défait}\\\\\\emph{et recréé par l\'État}', '1919 RCA: \\emph{monopoly undone}\\\\\\emph{and remade by the State}'),
    ('{radio point à point}', '{point-to-point radio}'),
    ('1920 KDKA~: \\emph{émettre}\\\\\\emph{pour vendre des récepteurs}', '1920 KDKA: \\emph{broadcasting}\\\\\\emph{to sell receivers}'),
    ('1922 WEAF~: \\emph{audience}\\\\\\emph{vendue à l\'annonceur}', '1922 WEAF: \\emph{audience}\\\\\\emph{sold to the advertiser}'),
    ('1927 Radio Act~:\\\\\\emph{licences d\'intérêt public}', '1927 Radio Act:\\\\\\emph{public-interest licences}'),
    ('{radiodiffusion}', '{broadcasting}'),
    ('saturation des lignes~:\\\\le multiplexage (1870--74)', 'line saturation:\\\\multiplexing (1870--74)'),
    ('l\'interurbain demande l\'amplification~:\\\\Pupin 1900, audion 1906, répéteur 1915', 'long distance calls for amplification:\\\\Pupin 1900, audion 1906, repeater 1915'),
    ('la commutation~: du calcul\\\\dans le réseau', 'switching: computation\\\\inside the network'),
    ('poteaux, droits de passage,\\\\ateliers (Western Electric 1882)', 'poles, rights of way,\\\\workshops (Western Electric 1882)'),
    ('{la location de l\'appareil}', '{leasing the set}'),
    ('location + consommable~:\\\\la tabulatrice (1890)', 'lease + consumable:\\\\the tabulator (1890)'),
    ('la cabine payante\\\\devient le \\emph{toll}', 'the pay station\\\\becomes the \\emph{toll}'),
    ('{hors dépendance électrique constitutive}', '{no constitutive dependence on electricity}'),
    ('{électricité constitutive de l\'opération}', '{electricity constitutive of the operation}'),
    ('{énergie mobilisée en continu pour la disponibilité}', '{energy drawn continuously for availability}'),
    ('{brevet ou démonstration}', '{patent or demonstration}'),
    ('{forme économique retenue~; de l\'un à l\'autre, la tige}', '{economic form retained; from one to the other, the stem}'),
    ('{capacité en attente d\'un payeur}', '{capacity awaiting a payer}'),
    ('{un substrat repris (emprises, ateliers, opérateurs)}', '{a substrate taken over (land, workshops, staff)}'),
    ('{une forme transférée (qui paie, à quel titre)}', '{a form transferred (who pays, on what terms)}'),
    ('{un problème posé à la lignée suivante}', '{a problem handed to the next lineage}'),
]

CONFLUENCE = [
    ('{échelle du temps multipliée par 2,5 après 1935}', '{time scale stretched 2.5 times after 1935}'),
    ('{des techniques situées}', '{situated techniques}'),
    ('{une technologie-capital, mondiale}', '{a capital technology, worldwide}'),
    ('\\emph{monopole d\'État}', '\\emph{state monopoly}'),
    ('\\emph{commande publique, puis monopoles}', '\\emph{public commission, then monopolies}'),
    ('\\emph{actifs réemployés par le téléphone}', '\\emph{assets reused by the telephone}'),
    ('\\emph{location de l\'appareil}', '\\emph{leasing of the set}'),
    ('années 1990~: \\emph{le réseau numérique}\\\\\\emph{réemploie le cuivre téléphonique}', '1990s: \\emph{the digital network}\\\\\\emph{reuses the telephone copper}'),
    ('\\emph{service national intégré}', '\\emph{integrated national service}'),
    ('\\emph{location, refus d\'interconnexion}', '\\emph{leasing, refusal to interconnect}'),
    ('1919 RCA~: \\emph{la Navy}~; 1920 KDKA', '1919 RCA: \\emph{the Navy}; 1920 KDKA'),
    ('\\emph{émettre pour vendre des récepteurs}~; 1922 \\emph{audience vendue}', '\\emph{broadcasting to sell receivers}; 1922 \\emph{audience sold}'),
    ('2009 \\emph{télévision hertzienne éteinte}\\\\\\emph{(États-Unis), 2011 (France)}', '2009 \\emph{analogue television switched off}\\\\\\emph{(United States), 2011 (France)}'),
    ('\\emph{engagement des opérateurs}', '\\emph{operators\' commitment}'),
    ('{\\emph{audience vendue}}', '{\\emph{audience sold}}'),
    ('\\emph{l\'État paie, les usagers écrivent}', '\\emph{the State pays, the users write}'),
    ('\\textbf{un seul fonds}~: calcul, stockage, transmission,\\\\\\emph{capacité louée}~; formé aux États-Unis,\\\\la Chine à part~; règles nationales ou régionales',
     '\\textbf{a single stock}: computation, storage, transmission,\\\\\\emph{leased capacity}; formed in the United States,\\\\China apart; national or regional rules'),
    ('le fonds, 1969-2025~:\\\\\\emph{voir le bandeau du bas}', 'the stock, 1969-2025:\\\\\\emph{see the band below}'),
    ('\\emph{bureau de calcul, commande publique}', '\\emph{computing office, public commission}'),
    ('{Babbage, \\emph{payeur sans demande} (Royaume-Uni)}', '{Babbage, \\emph{a payer without demand} (UK)}'),
    ('\\emph{commande de mission}', '\\emph{mission order}'),
    ('{Colossus (Royaume-Uni)}', '{Colossus (UK)}'),
    ('1952 transistor \\emph{sous licence} (Bell)~; 1956 \\emph{ouverture obligatoire}~;\\\\1964 System/360~; 1969 \\emph{programme licencié}',
     '1952 transistor \\emph{under licence} (Bell); 1956 \\emph{compulsory licensing};\\\\1964 System/360; 1969 \\emph{software under licence}'),
    ('\\emph{location et cartes exclusives}', '\\emph{leasing and exclusive cards}'),
    ('\\emph{machine louée}', '\\emph{leased machine}'),
    ('{OGAS (URSS)}', '{OGAS (USSR)}'),
    ('{Cybersyn (Chili)}', '{Cybersyn (Chile)}'),
    ('1851 arithmomètre · France\\\\\\emph{vente}', '1851 arithmometer · France\\\\\\emph{sale}'),
    ('{calculatrice mécanique*}', '{mechanical calculator*}'),
    ('\\emph{interfaces publiées}', '\\emph{published interfaces}'),
    ('\\emph{documents dispersés}', '\\emph{scattered documents}'),
    ('1890 carte perforée\\\\\\emph{consommable exclusif}', '1890 punched card\\\\\\emph{exclusive consumable}'),
    ('\\emph{vente du support}', '\\emph{sale of the medium}'),
    ('\\emph{la copie dissociée du support}~;\\\\\\emph{puis l\'accès au catalogue}', '\\emph{the copy parted from the medium};\\\\\\emph{then access to the catalogue}'),
    ('1958 circuit intégré~; 1965 \\emph{feuille de route}', '1958 integrated circuit; 1965 \\emph{roadmap}'),
    ('1976 VLSI · Japon~; 1987 TSMC* · Taïwan~; 1997 EUV, ASML* · Pays-Bas', '1976 VLSI · Japan; 1987 TSMC* · Taiwan; 1997 EUV, ASML* · Netherlands'),
    ('\\emph{les clients concurrents}\\\\\\emph{financent l\'amont}', '\\emph{competing customers}\\\\\\emph{fund the upstream}'),
    ('la fabrication~: Taïwan, Corée,\\\\Pays-Bas, Japon, États-Unis', 'manufacturing: Taiwan, Korea,\\\\the Netherlands, Japan, United States'),
    ('\\emph{l\'éclairage vendu}~; 1892 \\emph{taux de charge}*~; 1907 \\emph{monopole régulé}', '\\emph{lighting sold}; 1892 \\emph{load factor}*; 1907 \\emph{regulated monopoly}'),
    ('\\emph{raccordements~: le téléphone, la radio, le calcul, la mémoire, le Web, le nuage}', '\\emph{connections: the telephone, radio, computing, memory, the Web, the cloud}'),
    ('2024 \\emph{le fonds contracte}\\\\\\emph{sa charge}~: PPA', '2024 \\emph{the stock contracts}\\\\\\emph{its load}: PPA'),
    ('{réseau électrique}', '{electric grid}'),
    ('{transmettre}', '{transmit}'), ('{calculer}', '{compute}'), ('{stocker}', '{store}'),
    ('{composants}', '{components}'), ('{électricité}', '{electricity}'), ('{le fonds, 1969-2025}', '{the stock, 1969-2025}'),
    ('\\emph{interface ouverte}', '\\emph{open interface}'),
    ('1993 Web~: \\emph{domaine public}~;\\\\\\emph{le logiciel, actif fixe} (SNA)', '1993 Web: \\emph{public domain};\\\\\\emph{software, a fixed asset} (SNA)'),
    ('\\emph{audience vendue,}\\\\\\emph{attribution individualisée}', '\\emph{audience sold,}\\\\\\emph{individual attribution}'),
    ('\\emph{capacité louée, 99,99~\\%}', '\\emph{leased capacity, 99.99\\%}'),
    ('2007 \\emph{numérique~: télécom 99,9~\\%,}\\\\\\emph{stockage 94~\\%}~; le terminal~;\\\\61~TWh \\emph{comptés} (EPA)',
     '2007 \\emph{digital: telecom 99.9\\%,}\\\\\\emph{storage 94\\%}; the handset;\\\\61~TWh \\emph{counted} (EPA)'),
    ('\\emph{canal contrôlé}~;\\\\2009 Alibaba (Chine)', '\\emph{controlled channel};\\\\2009 Alibaba (China)'),
    ('\\emph{le jeton}', '\\emph{the token}'),
    ('\\emph{charge contractualisée}', '\\emph{load under contract}'),
    ('États-Unis', 'United States'), ('Royaume-Uni', 'United Kingdom'),
]
CAPTION_FR = re.compile(r'Chaque ligne est une technique située.*?\*~date hors du registre, à vérifier\.', re.S)
CAPTION_EN = ("Each line is a situated technique: a place, a payer, a form, at the date of its first entry into service "
              "(filled dot; hollow circle: patent or proposal). The lines join at the dates and for the reasons that chapter~1 documents "
              "(in grey italics); the thick line is the stock they form from 1969, a single one in 2006, followed in the band below at its own scale.\n"
              "Line weight: dotted, no constitutive dependence on electricity; thin, electricity performs the operation; thick, energy held "
              "continuously for availability (thresholds 1895, 1958). \\textdagger~lineage extinct after serving; "
              "\\textcolor{black!45}{\\textdagger}~capacity set aside, never put into service: the branches history did not keep.\n"
              "Dashed: a form transferred (the audience sold, from the antenna to the platform; the principle of Cyclades in TCP/IP). "
              "Open grey arrow: a substrate taken over (components, electricity). *~date outside the register, to be checked.")

def english(src: str, pairs, caption=None) -> str:
    out = src
    for fr, en in pairs:
        if fr not in out:
            sys.exit(f'not found: {fr[:70]}')
        out = out.replace(fr, en)
    if caption:
        out, n = caption[0].subn(lambda m: caption[1], out)
        if n != 1: sys.exit('caption not found')
    for fr, en in COMMON:
        out = out.replace(fr, en)
    # Anything French left in the drawn text (comments aside)?
    for i, line in enumerate(out.splitlines(), 1):
        code = line.split('%')[0]
        if re.search(r'[éèêàçùâîôû]|\b(le|la|les|des|du|une|aux)\b', code) and '\\node' in code or (re.search(r'[éèàç]', code) and '{' in code):
            print(f'  left in French? line {i}: {code.strip()[:120]}')
    return out

for name, pairs, cap in [('transmit', TRANSMIT, None), ('confluence', CONFLUENCE, (CAPTION_FR, CAPTION_EN))]:
    src = (HERE / f'{name}.fr.tex').read_text()
    (HERE / f'{name}.en.tex').write_text(english(src, pairs, cap))
    print(f'{name}.en.tex written')
