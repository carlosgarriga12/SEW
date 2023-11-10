import xml.etree.ElementTree as ET

def textoParaLugarPolilinea(x, y, texto):
    cadenaTexto = f'<text x="{x}" y="{y}" style="writing-mode: tb; glyph-orientation-vertical: 0;">\n'
    cadenaTexto += texto + '\n'
    cadenaTexto += '</text>\n'
    return cadenaTexto

def generarKMLs(archivoXML):
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print("No se encuentra el archivo ", archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando el archivo ", archivoXML)
        exit()
    
    raiz = arbol.getroot()
    for i, ruta in enumerate(raiz.findall('{http://www.uniovi.es}ruta')):
        svg ='<?xml version="1.0" encoding="UTF-8"?>\n'+'<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n'
        points = ''
        altitudes = []
        alturaInicio = int(ruta.find("{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}altitud").text)
        nombreLugares = []
        nombreLugares.append(ruta.find("{http://www.uniovi.es}lugarInicio").text)
        altitudes.append(alturaInicio)
        for hito in ruta.findall("{http://www.uniovi.es}hitos/{http://www.uniovi.es}hito"):
            altitud = hito.find("{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}altitud").text
            altitudes.append(int(altitud))
            nombreLugares.append(hito.attrib['nombre'])

        maxAltitud = max(altitudes)
        points = ""
        initialX = 10
        points += f"{initialX}, {20 + maxAltitud}\n"
        text = ""

        text+= textoParaLugarPolilinea(initialX, 20 + maxAltitud + 10, "Nivel del mar") 

        distance = initialX
        distance += 50
        
        for j, altitud in enumerate(altitudes):
            y = 20 + (maxAltitud - altitud)
            points += f"{distance}, {y}\n"
            text += textoParaLugarPolilinea(distance, 20 + maxAltitud + 10, nombreLugares[j])
            distance+= 50
        
        points += f"{distance}, {20 + maxAltitud}\n"
        text += textoParaLugarPolilinea(distance, 20 + maxAltitud + 10, "Nivel del mar")
        points += f"{initialX}, {20 + maxAltitud}"

        svg += f'<polyline points="{points}" style="fill:white;stroke:red;stroke-width:4" />\n'
        svg += text
        svg+= '</svg>'

        with open(f"perfil{i+1}.svg", "w") as archivoSVG:
            archivoSVG.write(svg)


def main():
    generarKMLs("rutasEsquema.xml")


if __name__ == "__main__":
    main()