import datetime
import os
from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TPE1, TPE2, TALB, TRCK, TCON, APIC, TDRC
from services import compute_key

class Services:
    
    __slots__ = ['top_dir']

    def __init__(self, top_dir='data'):
        self.top_dir = top_dir
        
    def __abs_path(self):
        return os.path.abspath(self.top_dir)
    
    def is_audio(self, path):
        extensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac']
        ext = os.path.splitext(path)[1].lower()
        return ext in extensions and os.path.isfile(path)
    
    def __handle_file(self, path, contents):
        if self.is_audio(path):
            contents.append(path)
    
    def __handle_dir(self, name, directory, contents):
        items = os.listdir(directory)
        for item in items:
            path = os.path.join(directory, item)
            if os.path.isdir(path):
                if item not in contents:
                    contents[item] = []
                self.__handle_dir(item, path, contents[name])
            else:
                if item not in contents:
                    contents[item] = []
                self.__handle_file(path, contents[name])
        
    def get_items(self):
        items = os.listdir(self.top_dir)
        contents = {}
        for item in items:
            path = os.path.join(self.top_dir, item)
            if os.path.isdir(path):
                contents[item] = self.__get_items_recursive(path)
            else:
                if "files" not in contents:
                    contents["files"] = []
                self.__handle_file(path, contents["files"])
        return contents

    def __get_items_recursive(self, directory):
        contents = []
        items = os.listdir(directory)
        for item in items:
            path = os.path.join(directory, item)
            if os.path.isdir(path):
                contents.append({item: self.__get_items_recursive(path)})
            else:
                self.__handle_file(path, contents)
        return contents
    
    def get_id3_info(self, path):
        try:
            audio = ID3(path)
            info = {}
            for k in audio.keys():
                if k == 'TIT2':
                    info['title'] = TIT2(encoding=3, text=audio[k][0])
                elif k == 'TPE1':
                    info['artist'] = TPE1(encoding=3, text=audio[k][0])
                elif k == 'TPE2':
                    info['album_artist'] = TPE2(encoding=3, text=audio[k][0])
                elif k == 'TALB':
                    info['album'] = TALB(encoding=3, text=audio[k][0])
                elif k == 'TRCK':
                    info['track_num'] = TRCK(encoding=3, text=audio[k][0])
                elif k == 'TCON':
                    info['genre'] = TCON(encoding=3, text=audio[k][0])
                elif k == 'APIC':
                    info['artwork'] = APIC(encoding=3, text=audio[k][0])
                elif k == 'TDRC':
                    release = audio.get('TDRC')
                    if release:
                        release_str = str(release)
                        info['release_date'] = TDRC(encoding=3, text=[release_str])
                    else:
                        info['release_date'] = None
                else:
                    pass
            return info
        except FileNotFoundError:
            return FileNotFoundError(f'{path} not found in {self.top_dir}...')
        
        
    def modify_id3_info(self, path, values):
        try:
            audio = ID3(path)
            changed_filename = False
            for tag in values.keys():
                if tag == 'TIT2':
                    audio[tag] = TIT2(encoding=3, text=values[tag])
                    rel_path = os.path.relpath(path)
                    extension = os.path.splitext(rel_path)[1]
                    file_name = os.path.basename(rel_path)
                    new_path = path.replace(file_name, (values[tag] + extension))
                    changed_filename = True
                elif tag == 'TPE1':
                    audio[tag] = TPE1(encoding=3, text=values[tag])
                elif tag == 'TPE2':
                    audio[tag] = TPE2(encoding=3, text=values[tag])
                elif tag == 'TALB':
                    audio[tag] = TALB(encoding=3, text=values[tag])
                elif tag == 'TRCK':
                    audio[tag] = TRCK(encoding=3, text=values[tag])
                elif tag == 'TCON':
                    audio[tag] = TCON(encoding=3, text=values[tag])
                elif tag == 'APIC':
                    audio[tag] = APIC(encoding=3, text=values[tag])
                elif tag == 'TDRC':
                    audio[tag] = TDRC(encoding=3, text=[str(values[tag])])
                else:
                    pass

            audio.save()
            if changed_filename:
                os.replace(path, new_path)
                return self.get_id3_info(new_path)
            else:
                return self.get_id3_info(path)
        except FileNotFoundError:
            return FileNotFoundError(f'{path} not found in {self.top_dir}...')
        
    def delete_file(self, path):
        try:
            os.remove(path)
        except FileNotFoundError:
            return FileNotFoundError(f'{path} not found in {self.top_dir}...')
        
    def clean_data(self):
        for root, dirs, files in os.walk(self.top_dir):
            for name in files:
                path = os.path.join(root, name)
                if not self.is_audio(path):
                    self.delete_file(path)
                    
def main():
    pass

            
