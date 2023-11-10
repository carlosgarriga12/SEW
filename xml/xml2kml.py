import xml.etree.ElementTree as ET

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
        kml ='<?xml version="1.0" encoding="UTF-8"?>\n'+'<kml xmlns="http://www.opengis.net/kml/2.2">\n'+'<Document>\n'
        kml += f"<Placemark>\n<name>ruta{i+1}</name>\n<LineString>\n<coordinates>\n"
        longitudInicio = ruta.find("{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}longitud").text
        latitudInicio = ruta.find("{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}latitud").text
        altitudInicio = ruta.find("{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}altitud").text
        kml+= f"{longitudInicio},{latitudInicio},{altitudInicio}\n"
        for hito in ruta.findall("{http://www.uniovi.es}hitos/{http://www.uniovi.es}hito"):
            longitud = hito.find("{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}longitud").text
            latitud = hito.find("{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}latitud").text
            altitud = hito.find("{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}altitud").text
            kml+= f"{longitud},{latitud},{altitud}\n"
        kml += "</coordinates>\n</LineString>\n</Placemark>\n"
        kml+= "</Document>\n</kml>"
        with open(f"ruta{i+1}.kml", "w") as archivoKML:
            archivoKML.write(kml)

def main():
    generarKMLs("rutasEsquema.xml")

if __name__ == "__main__":
    main()